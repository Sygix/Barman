module.exports = {
    name: 'report',
    description: 'report an error or something that is not working to the bot devs',
    aliases: ['feedback'],
    usage: '(error code/error description)',
    exemple: 'report music bot stopped playing music when asked to skip',
    cooldown: 60,
    args: true,
    guildOnly: false,
    hidden: false,
    category: 'tools',
    active: true,
    execute(msg, args) {
        var text = '';
        for(let i = 0; i < args.length; i++){
            text += args[i] + " ";
        }
        bot.guilds.get('291817674894344193').channels.get('669313257143664691').send({
            embed: {
                "title": "**REPORT**",
                "description": text,
                "timestamp": Date.now(),
                "color": 8913023,
                "footer": {
                    "icon_url": msg.author.avatarURL,
                    "text": msg.author.tag
                },
            }
        })
            .then(
                msg.channel.send("Your report has been sent to devs, thanks for your help improving this bot. Also make sure to join the support discord server at https://sygix.fr/discord")
            );
    },
};