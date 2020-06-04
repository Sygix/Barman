const queue = musicQueue;

module.exports = {
    name: 'pause',
    description: 'Mettre la musique en play/pause',
    aliases: ['resume'],
    usage: '',
    cooldown: 0,
    args: false,
    guildOnly: true,
    hidden: false,
    category: 'Musique',
    active: true,
    execute(msg, args) {
        //Get guild queue
        let serverQueue = queue.get(msg.guild.id);

        if (!msg.member.voiceChannel) if(msg.member.voiceChannel !== msg.client.voiceConnections.get(msg.guild.id).channel)
            return msg.channel.send('Vous devez être dans le même canal vocal que moi pour arrêter la musique !');
        if (!serverQueue) return msg.channel.send("Il n'y a pas de musique en cours de lecture !");

        msg.delete();

        if(serverQueue.playing){//PLAYING
            serverQueue.connection.dispatcher.pause();
            serverQueue.playing = false;
            serverQueue.pauseTimeout = setTimeout(() => {
                if(!serverQueue.playing){
                    serverQueue.songs = [];
                    serverQueue.connection.dispatcher.end();
                }
            }, 1800*1000); //30mins

            const newEmbed = new Discord.RichEmbed(serverQueue.playingMessage.embeds[0])
                .setTitle('Maintenant en Pause :pause_button:');
            serverQueue.playingMessage.edit(newEmbed);
        }else{//PAUSED
            serverQueue.connection.dispatcher.resume();
            serverQueue.playing = true;
            clearTimeout(serverQueue.pauseTimeout);
            serverQueue.pauseTimeout = null;
            const newEmbed = new Discord.RichEmbed(serverQueue.playingMessage.embeds[0])
                .setTitle('Joue Maintenant :musical_note:');
            serverQueue.playingMessage.edit(newEmbed);
        }
    },
};