const ytdl = require('ytdl-core');

module.exports = {
    name: 'music',
    description: 'play music into a voice channel',
    aliases: ['musique', 'm'],
    exemple: '(play, stop)',
    cooldown: 0,
    args: true,
    guildOnly: true,
    hidden: true,
    category: 'music',
    active: false,
    async execute(msg, args) {

        if(!msg.member.voiceChannel)
            return msg.channel.send("You must be in a voice channel for me to start playing music");
        if(msg.guild.me.voiceChannel)
            return msg.channel.send("Im busy at a different voice channel on the server. Try again later.");

        if(!args[0])
            return msg.channel.send("Please enter a youtube URL for me to load the song from.");

        let validate = await ytdl.validateURL(args[0]);
        if(!validate)
            return msg.channel.send("Whoops, re-check the URL you gave me, I am getting an error while trying to play the song. ");

        let info = await ytdl.getInfo(args[0]);
        let voiceChannel = msg.member.voiceChannel;
        let connection = await voiceChannel.join();
        let dispatcher = await connection.playStream(ytdl(args[0], {filter: 'audioonly'}))
            .on("end", end => {
                msg.channel.send(`Finished Playing: ${info.title}`);
                voiceChannel.leave();
            })
            .on("error", error => {
                console.error(error);
                msg.channel.send("Error Occurred during playback. Try again later.");
            });
        return msg.channel.send(`Now Playing: ${info.title}`);
    },
};