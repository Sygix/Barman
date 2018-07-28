const msToTime = require('../functions/msToTime');
const cleverBotCalls = require('../functions/cleverBotCalls');
const r6sStats = require('../functions/r6sStats');
const createEmbed = require('../functions/createEmbed');
const createTVC = require('../functions/createTempVoiceChannel');
const loupGarou = require('../functions/loupgarou');
const morpionGame = require('../functions/morpionGame');
const R6 = new r6sStats();
module.exports = class commands{

    static async check(msg){
        if(msg.content === botMention + 'help'){
            msg.channel.send("Liste des commandes disponible :\n" +
                "  - @Barman help\n" +
                "  - @Barman ping\n" +
                "  - @Barman maths (calcul)\n" +
                "  - @Barman ia (message)\n" +
                "  - @Barman voice (0-99) [public / @user @user]\n" +
                "  - @Barman morpion (ia / human)\n" +
                "  - SOON @Barman loupgarou\n" +
                //"  - SOON @Barman r6s (pseudo) [uplay, xone, ps4] [op/saison]\n" +
                "  - @Barman clear (2-100)\n" +
                "  - @Barman uptime\n" +
                "  - @Barman invite\n" +
                "Informations complémentaire et aide disponible sur ce discord : http://discord.gg/JMXbw4E \n" +
                "() = champ obligatoire | [] = champ optionnel | Bot by Sygix#3290");
        }
        if(msg.content === botMention + 'ping'){
            msg.channel.send('pong :ping_pong:');
        }
        if(msg.content === botMention + 'uptime'){
            msg.channel.send(msToTime.msToTime(bot.uptime));
        }
        if(msg.toString().startsWith(botMention + 'maths')){
            let msgArray = msg.toString().split(" ");
            try {
                msg.channel.send(eval(msgArray[2]) + ":nerd:");
            } catch (e) {
                msg.channel.send("Je ne comprend pas ce calcul ! :cry:");
            }
        }
        if(msg.toString().startsWith(botMention + 'ia')){
            let msgArray = msg.toString().split(" ");
            let text = '';
            for(let i = 2; i < msgArray.length; i++){
                text += msgArray[i] + " ";
            }
            cleverBotCalls.askBot(text, msg);
        }
        if(msg.toString().startsWith(botMention + 'loupgarou')){
            //loupGarou.callLoupGarou(msg);
            msg.channel.send("Commande en développement");
        }
        if(msg.toString().startsWith(botMention + 'r6s')){
            msg.channel.send("Commande en développement");
            /*let msgArray = msg.toString().split(" ");
            if(msgArray[4] == 'op'){
                R6.stats(msgArray[2], msgArray[3], true, false).then(response => {
                    msg.channel.send(createEmbed.createR6(response, 'op'));
                }).catch(error => {
                    msg.channel.send(error.toString());
                });
            }else if(msgArray[4] == 'saison'){
                R6.stats(msgArray[2], msgArray[3], false, true).then(response => {
                    msg.channel.send(createEmbed.createR6(response, 'saison'));
                }).catch(error => {
                    msg.channel.send(error.toString());
                });
            }else{
                R6.stats(msgArray[2], msgArray[3], false, false).then(response => {
                    msg.channel.send(createEmbed.createR6(response, null));
                }).catch(error => {
                    msg.channel.send(error.toString());
                });
            }*/
        }
        if(msg.toString().startsWith(botMention + 'voice')){
            let msgArray = msg.toString().split(" ");
            if(msg.member.voiceChannel != null && !tempChannels.has(msg.member.id)){
                if(msgArray[3] === 'public'){
                    createTVC.create(msg.channel, msg.member, msg.guild, msg.mentions.members.array(), msgArray[2], true);
                }else {
                    createTVC.create(msg.channel, msg.member, msg.guild, msg.mentions.members.array(), msgArray[2]);
                }
            }else{
                msg.channel.send("Vous devez être connecté à un channel vocal/Vous avez déjà un channel vocal.");
            }
        }
        if(msg.content === botMention + 'invite'){
            msg.member.createDM()
                .then(function (dm) {
                    dm.send('Hey, tu souhaites m\'ajouter sur ton discord ? Pas de soucis clique sur le lien ci-dessous, à tout de suite :blush:\n' +
                        'https://bit.ly/2HpxUrB');
                    dm.delete();
                })
                .catch(console.error);
            msg.channel.send("Je t'ai envoyé le lien d'invitation, regarde tes messages privés :smiley:");
        }
        if(msg.toString().startsWith(botMention + 'clear')){
            // This command removes all messages from all users in the channel, up to 500.
            // get the delete count, as an actual number.
            let msgArray = msg.toString().split(" ");
            const deleteCount = parseInt(msgArray[2], 10)+1;

            // Ooooh nice, combined conditions. <3
            if(!deleteCount || deleteCount < 2 || deleteCount > 100)
                return msg.reply("Merci de donner un nombre de messages à supprimer entre 1 et 99 compris.");

            // So we get our messages, and delete them. Simple enough, right?
            const fetched = await msg.channel.fetchMessages({limit: deleteCount});
            msg.channel.bulkDelete(fetched)
                .then(function () {
                    msg.reply(deleteCount + " messages ont été supprimé !")
                        .then(sent => {
                            sent.delete(2000);
                        });
                })
                .catch(error => msg.reply(`Je n'ai pas réussi à supprimer les messages : ${error}`));
        }
        if(msg.toString().startsWith(botMention + 'morpion')){
            let msgArray = msg.toString().split(" ");
            if(msgArray[2] === 'ia'){
                var morpion = new morpionGame(msg, msg.member);
                morpion.start(['human', 'ai']);
            }else if(msgArray[2] === 'human'){
                msg.channel.send('Cette partie est encore en développement, patience !');
            }
        }
    }

};