const queue = musicQueue;

module.exports = {
    name: 'queue',
    description: "Voir les musiques qui arrivent.",
    aliases: ['upnext'],
    exemple: '[2]',
    cooldown: 3,
    args: false,
    guildOnly: true,
    hidden: false,
    category: 'Musique',
    active: true,
    execute(msg, args) {
        let serverQueue = queue.get(msg.guild.id);
        if (!serverQueue) return msg.channel.send("Il n'y a pas de file d'attente !");
        var page = 1;
        if(!isNaN(args[0]) && args[0] > 1){
            if(Math.ceil(serverQueue.songs.length/5) >= args[0]){
                page = Math.ceil((args[0]*serverQueue.songs.length)/(serverQueue.songs.length/5))-4;
            }
        }

        var queuetext = "il n'y a pas de musique en attente.";
        for (i = page; i < serverQueue.songs.length; i++){
            if(i > page+4) break;
            let song = serverQueue.songs[i];
            if(i === page){
                queuetext = "``"+i+" -`` ["+song.title+"]("+song.url+") | Durée : ``"+song.length+"`` | Demandé par : ``"+song.author+"``\n";
            }else{
                queuetext += "``"+i+" -`` ["+song.title+"]("+song.url+") | Durée : ``"+song.length+"`` | Demandé par : ``"+song.author+"``\n";
            }
        }

        let song = serverQueue.songs[0];
        let waiting = serverQueue.songs.length-1;
        msg.channel.send({
                embed: {
                    "title": serverQueue.playing ? "Joue Maintenant :musical_note:" : "Maintenant en Pause :pause_button:",
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