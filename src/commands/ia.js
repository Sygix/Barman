const cleverbot = require('cleverbot.io');

module.exports = {
    name: 'ia',
    aliases: ['ai'],
    description: 'Parle avec une intelligence artificielle.',
    args: true,
    usage: '(message)',
    guildOnly: true,
    async execute(msg, args) {
        const cleverBot = new cleverbot('8sKTrhlp8UIjAS4H', process.env.CleverKEY); //process.env.CleverKEY
        var text = '';
        for(let i = 0; i < args.length; i++){
            text += args[i] + " ";
        }
        cleverBot.setNick(msg.member.displayName);
        try{
            cleverBot.create(function (err, session) { // Initialize Cleverbot

                cleverBot.ask(text, function (err, response) {
                    msg.channel.send(response);
                });

            });
        }catch (e){
            msg.channel.send("Je ne fonctionne pas, réessaie plus tard :cry:");
        }
    },
};