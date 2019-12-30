const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const ytpl = require('ytpl');
const msToTime = require('../functions/msToTime');
const queue = musicQueue;

module.exports = {
    name: 'music',
    description: 'play music into a voice channel',
    aliases: ['musique', 'm', 'play', 'p'],
    exemple: 'YT music name/link/playlist link [number of the playlist songs you want]',
    cooldown: 0,
    args: true,
    guildOnly: true,
    hidden: false,
    category: 'music',
    active: true,
    async execute(msg, args) {
        //Get guild queue
        var serverQueue = queue.get(msg.guild.id);
        //Check perms
        const voiceChannel = msg.member.voiceChannel;
        if (!voiceChannel) return msg.channel.send('Vous devez être dans un canal vocal pour jouer de la musique !');
        const permissions = voiceChannel.permissionsFor(msg.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
            return msg.channel.send("J'ai besoin des permissions de rejoindre et de parler dans ce cannal.");
        }

        let validatePl = await ytpl.validateURL(args[0]);
        if(!validatePl){
            let validate = await ytdl.validateURL(args[0]);
            if(!validate) {
                let search = '';
                for(let i = 0; i < args.length; i++){
                    search += args[i] + " ";
                }
                ytsr(search, {limit: 1})
                    .then( (result) => getSongInfo(result.items[0].link))
                    .catch( (err) => msg.channel.send("Whoops, je n'ai rien trouvé pour vous !"));
            }else{
                getSongInfo(args[0]);
            }
        }else{
            if(args[1] !== undefined && !args[1].isNaN) {
                ytpl(args[0], {limit: args[1]})
                    .then( result => {
                        addPlaylist(result.items);
                    })
                    .catch( () => {
                        ytsr(args[0], {limit: 1})
                            .then( (result) => getSongInfo(result.items[0].link))
                            .catch( (err) => msg.channel.send("Whoops, je n'ai rien trouvé pour vous !"));
                    });
            }else{
                ytpl(args[0], {limit: 0})
                    .then( result => {
                        addPlaylist(result.items);
                    })
                    .catch( () => {
                        ytsr(args[0], {limit: 1})
                            .then( (result) => getSongInfo(result.items[0].link))
                            .catch( (err) => msg.channel.send("Whoops, je n'ai rien trouvé pour vous !"));
                    });
            }

        }

        async function addPlaylist(items) {

            for(let i = 0; i < items.length; i++){
                let music = items[i];

                const song = {
                    title: music.title,
                    url: music.url_simple,
                    thumbnail: music.thumbnail,
                    length: music.duration,
                    author: msg.author.username,
                };

                if (!serverQueue) {
                    const queueContruct = {
                        textChannel: msg.channel,
                        voiceChannel: voiceChannel,
                        connection: null,
                        songs: [],
                        playing: true,
                    };

                    queue.set(msg.guild.id, queueContruct);
                    serverQueue = queueContruct;
                    queueContruct.songs.push(song);

                    try {
                        var connection = await voiceChannel.join();
                        queueContruct.connection = connection;
                        play(msg, queueContruct.songs[0]);
                    } catch (err) {
                        console.log(err);
                        queue.delete(msg.guild.id);
                    }
                } else {
                    serverQueue.songs.push(song);
                }
            }
            msg.channel.send("La playlist à été ajouté à la file d'attente :headphones:");
        }

        async function getSongInfo(musicLink){
            //Get song infos
            const songInfo = await ytdl.getInfo(musicLink);
            if(songInfo.length_seconds > 1800) return msg.channel.send("La durée maximale par musique est de 30 minutes. :stopwatch:");
            const song = {
                title: songInfo.title,
                url: songInfo.video_url,
                thumbnail: songInfo.player_response.videoDetails.thumbnail.thumbnails[songInfo.player_response.videoDetails.thumbnail.thumbnails.length - 1].url,
                length: msToTime(songInfo.length_seconds*1000),
                author: msg.author.username,
            };

            if (!serverQueue) {
                const queueContruct = {
                    textChannel: msg.channel,
                    voiceChannel: voiceChannel,
                    connection: null,
                    songs: [],
                    playing: true,
                };

                queue.set(msg.guild.id, queueContruct);

                queueContruct.songs.push(song);

                try {
                    var connection = await voiceChannel.join();
                    queueContruct.connection = connection;
                    play(msg, queueContruct.songs[0]);
                } catch (err) {
                    console.log(err);
                    queue.delete(msg.guild.id);
                    return;
                }
            } else {
                serverQueue.songs.push(song);
                return msg.channel.send("``"+song.title+"`` à été ajouté à la file d'attente :headphones:");
            }
        }

        function play(msg, song) {
            const serverQueue = queue.get(msg.guild.id);

            if (!song || serverQueue.voiceChannel.members.array().length <= 1) {
                serverQueue.voiceChannel.leave();
                queue.delete(msg.guild.id);
                return;
            }

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
            serverQueue.connection.playStream(ytdl(song.url, {filter: 'audioonly'}), { seek: 0, volume: 0.7, bitrate: 96000})//Volume 0.7 for better quality at 100% on discord
                .on('end', () => {
                    serverQueue.songs.shift();
                    play(msg, serverQueue.songs[0]);
                })
                .on('error', error => {
                    console.error(error);
                    msg.channel.send("Malheureusement, une erreur s'est produite veuillez réessayer ultérieurement :confused:");
                });
        }
    },
};