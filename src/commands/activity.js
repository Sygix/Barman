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
            for(let i = 0; i < args.length; i++){
                text += args[i] + " ";
            }
            bot.user.setActivity(text);
        }
    },
};