const queue = musicQueue;

module.exports = {
    name: 'stop',
    description: 'Arrêter la lecture de musique.',
    aliases: ['leave'],
    exemple: '',
    cooldown: 0,
    args: false,
    guildOnly: true,
    hidden: false,
    category: 'Musique',
    active: true,
    async execute(msg, args) {
        let serverQueue = queue.get(msg.guild.id);

        if (!msg.member.voiceChannel) if(msg.member.voiceChannel !== msg.client.voiceConnections.get(msg.guild.id).channel)
            return msg.channel.send('Vous devez être dans le même canal vocal que moi pour arrêter la musique !');
        if (!serverQueue) return msg.channel.send("Il n'y a pas de musique à arrêter !");
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    },
};