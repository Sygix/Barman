module.exports = {
    name: 'clear',
    description: 'Efface des messages.',
    aliases: ['delete', 'remove', 'effacer', 'supprimer'],
    args: true,
    active: true,
    exemple: '99',
    usage: '(1-999)',
    guildOnly: true,
    category: 'Moderation',
    async execute(msg, args) {
        if(msg.member.hasPermission('MANAGE_MESSAGES') || msg.member.hasPermission('ADMINISTRATOR')){
            // This command removes all messages from all users in the channel, up to 500.
            // get the delete count, as an actual number.
            var totalDelete = 0;
            var deleteCount = parseInt(args[0], 10)+1;

            // Ooooh nice, combined conditions. <3
            if(!deleteCount || deleteCount < 2 || deleteCount > 1000)
                return msg.reply("Merci de donner un nombre de messages à supprimer entre 1 et 999 compris.");

            // So we get our messages, and delete them. Simple enough, right?
            while (deleteCount > 100){
                const fetched = await msg.channel.fetchMessages({limit: 100});
                msg.channel.bulkDelete(fetched)
                    .catch(error => msg.reply(`Une erreur s'est produite durant la suppression, ${totalDelete} message supprimé : ${error}`));
                deleteCount -= 100;
                totalDelete += 100;
            }
            const fetched = await msg.channel.fetchMessages({limit: deleteCount});
            msg.channel.bulkDelete(fetched)
                .then(function () {
                    msg.reply(totalDelete + deleteCount + " messages ont été supprimé !")
                        .then(sent => {
                            sent.delete(5000);
                        });
                })
                .catch(error => msg.reply(`Je n'ai pas réussi à supprimer les messages : ${error}`));
        }else{
            msg.reply('Malheureusement tu ne possèdes pas assez de permissions.')
        }
    },
};