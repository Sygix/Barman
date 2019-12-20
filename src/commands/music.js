const ytdl = require('ytdl-core');
const msToTime = require('../functions/msToTime');
const queue = musicQueue;

module.exports = {
    name: 'music',
    description: 'play music into a voice channel',
    aliases: ['musique', 'm', 'play', 'p', 'listen'],
    exemple: 'Youtube name/link or [stop, skip]',
    cooldown: 0,
    args: true,
    guildOnly: true,
    hidden: false,
    category: 'music',
    active: true,
    async execute(msg, args) {
        //Get guild queue
        const serverQueue = queue.get(msg.guild.id);
        //Check perms
        const voiceChannel = msg.member.voiceChannel;
        if (!voiceChannel) return msg.channel.send('Vous devez être dans un canal vocal pour jouer de la musique !');
        const permissions = voiceChannel.permissionsFor(msg.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
            return msg.channel.send("J'ai besoin des permissions de rejoindre et de parler dans ce cannal.");
        }

        //NEED TO ADD CHECK FOR VALID VIDEO AND SEARCH FOR NAME
        let validate = await ytdl.validateURL(args[0]);
        if(!validate) return msg.channel.send("Whoops, vérifiez l'URL que vous avez fournis !");

        //Get song infos
        const songInfo = await ytdl.getInfo(args[0]);
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
                return msg.channel.send(err);
            }
        } else {
            serverQueue.songs.push(song);
            // Changer ce message pour afficher correctement
            return msg.channel.send(`${song.title} à été ajouté à la file d'attente :headphones:`);
        }
    },
};

function play(msg, song) {
    const serverQueue = queue.get(msg.guild.id);

    if (!song || serverQueue.voiceChannel.members <= 1) {
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
    serverQueue.connection.playStream(ytdl(song.url, {filter: 'audioonly'}), {bitrate: 96000})
        .on('end', () => {
            serverQueue.songs.shift();
            play(msg, serverQueue.songs[0]);
        })
        .on('error', error => {
            console.error(error);
            msg.channel.send("Malheureusement, une erreur s'est produite veuillez réessayer ultérieurement " + msg.client.emojis.get('657345592321769482'));
        });
}