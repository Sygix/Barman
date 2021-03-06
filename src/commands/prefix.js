const firebase = require('../functions/firebase');

module.exports = {
    name: 'prefix',
    description: 'Définir le préfix du bot sur ce serveur.',
    aliases: [],
    exemple: '[set] ($)',
    cooldown: 15,
    args: false,
    guildOnly: true,
    hidden: false,
    category: 'Parametres',
    active: true,
    execute(msg, args) {
        if(typeof args[0] !== "undefined" && args[0].toLowerCase() === 'set'){
            if(msg.channel.permissionsFor(msg.author).has('MANAGE_GUILD')){
                firebase.updatePrefix(msg.guild.id, args[1]);
                firebase.getServerSettings(msg.guild.id)
                    .then(snap => {
                        msg.channel.send("Nouveau préfix défini sur '" + snap.val().prefix + "'");
                    });
            }else{
                msg.reply("Vous n'avez pas les droits nécéssaire au changement du préfix. ('MANAGE_GUILD')");
            }
        }else{
            firebase.getServerSettings(msg.guild.id)
                .then(snap => {
                    msg.channel.send("Le préfix actuel du serveur est '" + snap.val().prefix + "'");
                });
        }
    },
};