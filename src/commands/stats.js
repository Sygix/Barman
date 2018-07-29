const msToTime = require('../functions/msToTime');

module.exports = {
    name: 'stats',
    description: 'Statisques à propos du bot.',
    aliases: ['uptime', 'statistics', 'statistique', 'statistiques'],
    cooldown: 10,
    execute(msg, args) {
        msg.channel.send(msToTime(bot.uptime));
    },
};