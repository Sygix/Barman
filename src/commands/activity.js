module.exports = {
    name: 'activity',
    description: 'activity',
    aliases: [],
    usage: '() []',
    exemple: '',
    cooldown: 0,
    args: true,
    guildOnly: false,
    hidden: true,
    category: 'Admin',
    active: true,
    execute(msg, args) {
        if(msg.author.id === '175989402974158848'){
            var text = '';
            for(let i = 1; i < args.length; i++){
                text += args[i] + " ";
            }
            bot.user.setActivity(text, { type: args[0] })
                .then(presence => msg.channel.send(`Activity set to ${presence.activities[0].name} of type ${presence.activities[0].type}`))
                .catch(console.error);
        }
    },
};