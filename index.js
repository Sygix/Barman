global.Discord = require('discord.js');
const commands = require('./events/commands');
const launchInterval = require('./functions/launchInterval');
global.bot = new Discord.Client();
const cleverbot = require('cleverbot.io');
const createTVC = require('./functions/createTempVoiceChannel');
global.cleverBot = new cleverbot('8sKTrhlp8UIjAS4H', process.env.CleverKEY); //process.env.CleverKEY
global.botMention = '<@417683933891919882> ';
global.tempChannels = new Map(); //MemberID, VoiceChannelID

//Evenements
bot.on('ready', function () { //Lancement des functions lors du démarrage
    bot.user.setActivity('@Barman help | by Sygix');
    launchInterval.launch();
    cleverBot.setNick("France.LaTaverne.PROD");
});

bot.on('message', async function (msg) {
    commands.check(msg);
});
//Event LeaveChannel
bot.on('voiceStateUpdate', (oldMember, newMember) => {
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
        console.log(e);
    }
});

bot.login(process.env.DiscordTOKEN); //process.env.DiscordTOKEN

process.on('exit', function(code) {
    return console.log(`About to exit with code ${code}`);
});