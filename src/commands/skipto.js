const queue = musicQueue;

module.exports = {
    name: 'skipto',
    description: "Passe à une musique dans la file d'attente",
    aliases: ['sto'],
    exemple: '',
    cooldown: 0,
    args: true,
    guildOnly: true,
    hidden: false,
    category: 'Musique',
    active: true,
    async execute(msg, args) {
        let serverQueue = queue.get(msg.guild.id);

        if (!msg.member.voiceChannel) if(msg.member.voiceChannel !== msg.client.voiceConnections.get(msg.guild.id).channel)
            return msg.channel.send('Vous devez être dans le même canal vocal que moi pour passer la musique !');
        if (!serverQueue) return msg.channel.send("Il n'y a pas de musique à passer !");
        if(args.length < 1) return msg.channel.send("Merci de donner un numéro de musique a écouter.");
        if(!args[0].isNaN){
            if(args[0] < serverQueue.songs.length){
                for(i = args[0]-1; i > 0; i--){
                    serverQueue.songs.shift();
                }
                serverQueue.connection.dispatcher.end();
            }
        }else return msg.channel.send("Merci de donner un numéro de musique à écouter.");
    },
};