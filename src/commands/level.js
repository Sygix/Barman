const firebase = require('../functions/firebase');

module.exports = {
    name: 'level',
    description: 'Get your global level',
    aliases: ['xp', 'lvl', 'px'],
    usage: '[@user]',
    exemple: '@Sygix#3290',
    cooldown: 5,
    args: false,
    guildOnly: false,
    hidden: true,
    category: 'Level',
    active: true,
    execute(msg, args) {
        //firebase
        msg.channel.send('Comming Soon :D');
    },
};