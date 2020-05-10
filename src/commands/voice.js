const createTVC = require('../functions/createTempVoiceChannel');

module.exports = {
    name: 'voice',
    description: 'Créer un channel vocal temporaire.',
    aliases: ['voix'],
    args: true,
    active: true,
    usage: '(0-99) [public / @user @user]',
    exemple: '99 @Sygix @Solarus',
    guildOnly: true,
    category: 'Utilitaires',
    execute(msg, args) {
        if(!msg.guild.channels.find('name', 'Temporaire') || !msg.guild.channels.find('name', 'Rejoindre pour créer')){
            msg.channel.send("Les channels temporaire n'ont pas encore été mis en place sur ce discord.");
            if(msg.member.hasPermission('MANAGE_CHANNELS') || msg.member.hasPermission('ADMINISTRATOR')){
                msg.reply("Voulez-vous les mettres en place ? (Oui/Non)");
                const collector = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { time: 60000, errors: ['time'] });
                collector.on('collect', message => {
                    if (message.toString().toLowerCase() === 'oui') {
                        message.delete(2000);
                        msg.channel.send("Mise en place des channels temporaire en cours...")
                            .then(messageeee => {
                                msg.guild.createChannel('Temporaire', 'category')
                                    .then(channel => {
                                        msg.guild.createChannel('Rejoindre pour créer', 'voice')
                                            .then(channel2 => {
                                                channel2.setParent(channel);
                                                channel2.overwritePermissions(msg.guild.defaultRole , { //add @everyone perms
                                                    CONNECT: true,
                                                    SPEAK: false
                                                });
                                            })
                                            .catch(error => {
                                                msg.channel.send("Une erreur s'est produite");
                                                console.log(error);
                                                return;
                                            });
                                    })
                                    .catch(error => {
                                        msg.channel.send("Une erreur s'est produite");
                                        console.log(error);
                                        return;
                                    });
                                messageeee.edit("Les channels temporaire ont été mis en place !");
                            })
                            .catch(function (){
                                msg.channel.send("Une erreur s'est produite");
                                return;
                            });
                        collector.stop('success');
                    } else if(message.toString().toLowerCase() === "non"){
                        message.delete(2000);
                        msg.channel.send("Mise en place des channels temporaire refusée !");
                        collector.stop('success/callback');
                    }
                });
                collector.on('end', reason => {
                    if(reason.array().length <= 0){
                        msg.channel.send("La requète a expiré ! (60 secondes)");
                    }
                });
            }else{
                return;
            }
        }else{
            if(msg.member.voiceChannel != null && !tempChannels.has(msg.member.id)){
                if(args[1] === 'public'){
                    createTVC.create(msg.channel, msg.member, msg.guild, msg.mentions.members.array(), args[0], true);
                }else {
                    createTVC.create(msg.channel, msg.member, msg.guild, msg.mentions.members.array(), args[0]);
                }
            }else{
                msg.channel.send("Vous devez être connecté à un channel vocal/Vous avez déjà un channel vocal.");
            }
        }
    },
};