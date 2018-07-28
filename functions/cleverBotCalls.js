module.exports = class cleverBotCalls{

    static askBot(text, msg){
        try{
            cleverBot.create(function (err, session) { // Initialize Cleverbot

                cleverBot.ask(text, function (err, response) {
                    msg.channel.send(response);
                });

            });
        }catch (e){
            msg.channel.send("Je ne fonctionne pas :cry:");
        }
    }

};