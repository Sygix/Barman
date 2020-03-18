const fs = require('fs');
global.Discord = require('discord.js');
const { prefixes } = require('./config.json');

global.bot = new Discord.Client();
bot.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

const createTVC = require('./src/functions/createTempVoiceChannel');
const firebase = require('./src/functions/firebase');
const talkedRecently = new Set();
global.tempChannels = new Map(); //MemberID, VoiceChannelID
global.musicQueue = new Map();
global.botStatus = "OFFLINE";
const serversPrefix = new Map();
for (const file of commandFiles) {
    const command = require(`./src/commands/${file}`);
    if(command.active){
        bot.commands.set(command.name, command);
    }
}

bot.on('ready', function () { //Lancement des functions lors du démarrage
    bot.user.setActivity('Stay safe | @Barman help');
    firebase.connectFirebase();
    firebase.updateServers()
        .catch(error => console.log(error));
    prefixes.push(`<@!${bot.user.id}> `, `<@${bot.user.id}> `); //add Mentions to prefixes
    firebase.get('/cache/tempChannels')
        .then(snap => {
            if(snap.val() !== null){
                Object.keys(snap.val()).forEach(k => { //WILL NEED TO CHECK IF USER LEFT VOICE WHILE OFFLINE
                    tempChannels.set(k, snap.val()[k]);
                });
                firebase.delete('/cache/tempChannels');
            }
            botStatus = "STARTED";
        })
        .catch(err => console.log(err));
});

bot.on('message', async msg => {
    if(msg.author.bot)return;

    if (!talkedRecently.has(msg.author.id)) {
        firebase.updateXP(msg.author.id);
        firebase.getLevelFromFirebase(msg.author.id, (snap) => {
            firebase.updateLVL(msg.author.id, snap.val().xp);
        });

        talkedRecently.add(msg.author.id);
        setTimeout(() => {
            talkedRecently.delete(msg.author.id);
        }, 0);
    }

    if(msg.channel.type === 'text'){
        if(!serversPrefix.get(msg.guild.id)){
            firebase.getServerSettings(msg.guild.id)
                .then(snap => {
                    serversPrefix.set(msg.guild.id, snap.val().prefix);
                    checkPrefixAndExecute();
                })
                .catch(err => {
                    checkPrefixAndExecute();
                });
        }else{
            checkPrefixAndExecute();
        }
    }else{
        checkPrefixAndExecute();
    }

    function checkPrefixAndExecute() {
        let prefix = false;
        for(const thisPrefix of prefixes) {
            if(msg.content.startsWith(thisPrefix)) prefix = thisPrefix;
        }
        if(msg.channel.type === 'text'){
            if(msg.content.startsWith(serversPrefix.get(msg.guild.id))) prefix = serversPrefix.get(msg.guild.id);
        }

        if(!prefix) return;

        //Checking for BotStatus to block new requests
        if(botStatus !== "STARTED") return msg.channel.send("Barman is actually restarting/offline, please retry later.");

        const args = msg.content.slice(prefix.length).split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = bot.commands.get(commandName)
            || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return;

        if (command.guildOnly && msg.channel.type !== 'text') {
            return msg.reply('Je ne peux pas executer cette commande en DM !');
        }
        if (command.args && !args.length) {
            let reply = `Tu n'as donné aucun arguments, ${msg.author}!`;
            if (command.usage) {
                reply += `\nL'utilisation correcte de la commande est la suivante : ${prefix}\`${command.name} ${command.usage}\``;
            }
            return msg.channel.send(reply);
        }
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;

        if (!timestamps.has(msg.author.id)) {
            timestamps.set(msg.author.id, now);
            setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);
        }
        else {
            const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return msg.reply(`Merci d'attendre encore ${timeLeft.toFixed(1)} seconde(s) avant d'utiliser la commande \`${command.name}\`.`);
            }

            timestamps.set(msg.author.id, now);
            setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);
        }
        try {
            command.execute(msg, args);
        }
        catch (error) {
            console.error(error);
            msg.reply('Une erreur s\'est produite !');
        }
    }
});

//Event LeaveChannel
bot.on('voiceStateUpdate', (oldMember, newMember) => {
    //Checking for BotStatus
    if(botStatus !== "STARTED") return;

    let newUserChannel = newMember.voiceChannel;
    let oldUserChannel = oldMember.voiceChannel;
    try {
        if(newUserChannel !== undefined) {
            // User Joins a voice channel
            if(newUserChannel.parent.name === 'Temporaire' && newUserChannel.name === 'Rejoindre pour créer' && !tempChannels.has(oldMember.id)){
                createTVC.createWithoutMSG(newMember, newMember.guild);
            }
        } else if(newUserChannel === undefined){
            // User leave vocal
            if(oldMember.guild.channels.get(tempChannels.get(oldMember.id)).parent.name === 'Temporaire' && tempChannels.has(oldMember.id)){
                oldMember.guild.channels.get(tempChannels.get(oldMember.id)).delete('Temp channel deleted')
                    .then(function(){
                        tempChannels.delete(oldMember.id);
                        oldMember.createDM()
                            .then(function (dm) {
                                dm.send('Vous venez de quitter le vocal du serveur **'+oldMember.guild.name+'**, votre channel temporaire a été supprimé.');
                                dm.delete();
                            })
                            .catch(console.error);
                    })
                    .catch(console.error);
            }
        }
    }catch (e) {
        //console.log(e); IGNORING THIS ERROR
    }
});

bot.login(process.env.DiscordTOKEN); //process.env.DiscordTOKEN


//Caching closing signals before server stopping
process.once('SIGTERM', function (code) {
    console.log('SIGINT received... ');
    closeBot();
    process.exit();
});

process.once('SIGINT', function (code) {
    console.log('SIGINT received... ');
    closeBot();
    process.exit();
});

function closeBot() {
    botStatus = "CLOSING";
    // firebase.cacheMap(musicQueue, 'musicQueue')
    //    .catch(err => console.log(err));

    firebase.cacheMap(tempChannels, 'tempChannels')
        .then(() => {
            firebase.closeFirebase();
        })
        .catch(err => console.log(err));
    //cache game
    botStatus = "OFFLINE";
    bot.destroy();
    console.log('Finished closing app');
}

//(node:7104) DeprecationWarning: Guild#createChannel: Create channels with an options object instead of separate parameters
//(node:7104) DeprecationWarning: Collection#find: pass a function instead