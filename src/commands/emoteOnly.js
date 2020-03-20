module.exports = {
    name: 'emoteonly',
    description: 'Switch a channel to emotes only mode',
    aliases: ['eonly', 'eo', 'emotesonly'],
    usage: '',
    exemple: '',
    cooldown: 0,
    args: false,
    guildOnly: true,
    hidden: false,
    category: 'Moderation',
    active: true,
    execute(msg, args) {
        if(msg.member.hasPermission('MANAGE_CHANNELS') || msg.member.hasPermission('ADMINISTRATOR')){
            if(emoteMode.length < 1){
                emoteMode.push(msg.channel.id);
                msg.channel.send("__**Le channel est désormais en mode EMOTES seulement !**__");
                msg.delete().catch(console.error);
            }else{
                let count;
                emoteMode.forEach(id => {
                    if(id === msg.channel.id){
                        emoteMode.splice(count);
                        msg.channel.send("__**Le channel n'est désormais plus en mode EMOTES seulement !**__");
                    }else{
                        emoteMode.push(msg.channel.id);
                        msg.channel.send("__**Le channel est désormais en mode EMOTES seulement !**__");
                        msg.delete().catch(console.error);
                    }
                    count++;
                });
            }
        }else{
            msg.reply("vous n'avez pas les permissions suffisantes pour executer cette commande ! (MANAGE_CHANNELS)");
        }
    },
};