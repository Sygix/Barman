const queue = musicQueue;

module.exports = {
    name: 'playing',
    description: 'See current playing song',
    aliases: [],
    exemple: '',
    cooldown: 0,
    args: false,
    guildOnly: true,
    hidden: false,
    category: 'music',
    active: true,
    execute(msg, args) {
        let serverQueue = queue.get(msg.guild.id);
        if (!serverQueue) return msg.channel.send("Il n'y a pas de musique en cours !");
        let song = serverQueue.songs[0];
        let nextTitle = serverQueue.songs[1] !== undefined ? serverQueue.songs[1].title : 'Rien';
        msg.channel.send({
                embed: {
                    "title": "Joue Maintenant :musical_note:",
                    "description": "["+song.title+"]("+song.url+")\n\nDurée : ``"+song.length+"`` \n\nDemandé par : ``"+song.author+"``\n\nSuivant : ``"+nextTitle+"``",
                    "url": "https://discordapp.com/oauth2/authorize?client_id=417683933891919882&permissions=1610083447&scope=bot",
                    "color": 16711708,
                    "thumbnail": {
                        "url": song.thumbnail
                    }
                }
            }
        );
    },
};