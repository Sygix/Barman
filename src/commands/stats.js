const msToTime = require('../functions/msToTime');
const os = require('os');

module.exports = {
    name: 'stats',
    description: 'Statisques à propos du bot.',
    aliases: ['uptime', 'statistics', 'statistique', 'statistiques'],
    active: true,
    cooldown: 10,
    category: 'Informations',
    execute(msg, args) {
        msg.channel.send(
            {
                "embed": {
                    "title": "Statisques d'utilisation du Barman","url": "https://discordapp.com/oauth2/authorize?client_id=417683933891919882&permissions=1610083447&scope=bot",
                    "color": 45632,
                    "footer": {
                        "text": "by Sygix"
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
                        },
                        {
                            "name": "Utilisation de la mémoire vive",
                            "value": `${Math.round((os.totalmem() - os.freemem()) / ( 1024 * 1024 * 1024 )*100)/100} / ${Math.round(os.totalmem() / 
                                ( 1024 * 1024 * 1024 )*100)/100} Go`,
                            "inline": true
                        }/*,
                        {
                            "name": "Utilisation CPU",
                            "value": "",
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