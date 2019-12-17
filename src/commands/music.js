const ytdl = require('ytdl-core');

module.exports = {
    name: 'music',
    description: 'play music into a voice channel',
    aliases: ['musique', 'm'],
    exemple: '(play, stop)',
    cooldown: 0,
    args: false,
    guildOnly: true,
    hidden: true,
    category: 'music',
    active: true,
    execute(msg, args) {
        const channel = bot.channels.get("291817675540135936");
        if (!channel) return console.error("The channel does not exist!");
        channel.join().then(connection => {
            const stream = ytdl('https://www.youtube.com/watch?v=ZkqyIoYAXV8', { filter : 'audioonly' });
            const dispatcher = connection.playStream(stream, { seek: 0, volume: 1 });
            dispatcher.on("end", end => {
                channel.leave();
            });
        }).catch(e => {
            console.error(e);
        });
    },
};

//C:\Program Files\ffmpeg\bin\