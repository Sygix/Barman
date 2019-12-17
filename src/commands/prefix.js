const firebase = require('../functions/firebase');

module.exports = {
    name: 'prefix',
    description: 'Set or read bot prefix for this guild',
    aliases: [],
    exemple: '[set] ($)',
    cooldown: 15,
    args: false,
    guildOnly: true,
    hidden: false,
    category: 'settings',
    active: true,
    execute(msg, args) {
        if(typeof args[0] !== "undefined" && args[0].toLowerCase() === 'set'){
            firebase.updatePrefix(msg.guild.id, args[1]);
            firebase.getServerSettings(msg.guild.id, (snap) => {
                msg.channel.send("Nouveau préfix défini sur '" + snap.val().prefix + "'");
            });
        }else{
            firebase.getServerSettings(msg.guild.id, (snap) => {
                msg.channel.send("Le préfix actuel du serveur est '" + snap.val().prefix + "'");
            });
        }
    },
};