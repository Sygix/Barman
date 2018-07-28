module.exports = class loupgarou{

    static callLoupGarou(msg){
        const channel = msg.channel;
        const message = msg;

        message.channel.send("Test or Change?");
        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {time: 15000});
        console.log(collector);
        collector.on('collect', message => {
            if (message.content == "Test") {
                message.channel.send("TEST OK!");
            } else if (message.content == "Change") {
                message.channel.send("789 or 456 ?");
                if (message.content == "789") {
                    message.channel.send("TEST OKKK!");
                } else if (message.content == "456") {
                    message.channel.send("TEST OOOOK");
                }
            }
        });
        collector.on('end', reason => {
            if(reason == 'user'){

            }else if(reason === null){
                message.channel.send("La requète à expiré ! (15 secondes)");
            }
        });
    }
};