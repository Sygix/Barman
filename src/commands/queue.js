const queue = musicQueue;

module.exports = {
    name: 'queue',
    description: "See what music is up next in",
    aliases: ['upnext'],
    exemple: '',
    cooldown: 0,
    args: false,
    guildOnly: true,
    hidden: false,
    category: 'music',
    active: true,
    execute(msg, args) {
        let serverQueue = queue.get(msg.guild.id);
        if (!serverQueue) return msg.channel.send("Il n'y a pas de file d'attente !");

        var queuetext = "il n'y a pas de musique en attente.";
        for (i = 1; i < serverQueue.songs.length; i++){
            if(i > 5) break;
            let song = serverQueue.songs[i];
            if(i === 1){
                queuetext = "``"+i+" -`` ["+song.title+"]("+song.url+") | Durée : ``"+song.length+"`` | Demandé par : ``"+song.author+"``\n";
            }else{
                queuetext += "``"+i+" -`` ["+song.title+"]("+song.url+") | Durée : ``"+song.length+"`` | Demandé par : ``"+song.author+"``\n";
            }
        }

        let song = serverQueue.songs[0];
        let waiting = serverQueue.songs.length-1;
        msg.channel.send({
                embed: {
                    "title": "Joue Maintenant :musical_note:",
                    "description": "["+song.title+"]("+song.url+")\n\nDurée : ``"+song.length+"`` \n\nDemandé par : ``"+song.author+"``",
                    "url": "https://discordapp.com/oauth2/authorize?client_id=417683933891919882&permissions=1610083447&scope=bot",
                    "color": 16711708,
                    "thumbnail": {
                        "url": song.thumbnail
                    },
                    "fields": [
                        {
                            "name": "__File d'attente__ :arrow_down:",
                            "value": queuetext
                        },
                        {
                            "name": "Total dans la file d'attente : "+waiting,
                            "value": "-"
                        }
                    ]
                }
            }
        );
    },
};