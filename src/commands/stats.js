const msToTime = require('../functions/msToTime');

module.exports = {
    name: 'stats',
    description: 'Statisques à propos du bot.',
    aliases: ['uptime', 'statistics', 'statistique', 'statistiques'],
    cooldown: 10,
    execute(msg, args) {
        msg.channel.send(
            {
                "embed": {
                    "title": "Statisques d'utilisation du Barman","url": "https://discordapp.com",
                    "color": 45632,
                    "footer": {
                        "text": "Sygix"
                    },
                    "fields": [
                        {
                            "name": "Nombre de serveurs",
                            "value": bot.guilds.array().length,
                            "inline": true
                        },
                        {
                            "name": "Nombre d'utilisateurs",
                            "value": bot.users.array().length,
                            "inline": true
                        },
                        {
                            "name": "Uptime",
                            "value": msToTime(bot.uptime),
                            "inline": true
                        }/*,
                        {
                            "name": "<:thonkang:219069250692841473>",
                            "value": "are inline fields",
                            "inline": true
                        },
                        {
                            "name": "<:thonkang:219069250692841473>",
                            "value": "these last two",
                            "inline": true
                        },
                        {
                            "name": "<:thonkang:219069250692841473>",
                            "value": "are inline fields",
                            "inline": true
                        }*/
                    ]
                }
            }
        );
    },
};