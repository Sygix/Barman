const queue = musicQueue;

module.exports = {
    name: 'stop',
    description: 'Stop playing music',
    aliases: [],
    exemple: '',
    cooldown: 0,
    args: false,
    guildOnly: true,
    hidden: false,
    category: 'music',
    active: true,
    async execute(msg, args) {
        let serverQueue = queue.get(msg.guild.id);

        if (!msg.member.voiceChannel || msg.member.voiceChannel !== msg.client.voiceConnections.get(msg.guild.id).channel)
            return msg.channel.send('Vous devez être dans le même canal vocal que moi pour arrêter la musique !');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    },
};