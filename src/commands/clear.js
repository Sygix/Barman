module.exports = {
    name: 'clear',
    description: 'Efface des messages.',
    aliases: ['delete', 'remove', 'effacer', 'supprimer'],
    args: true,
    usage: '(1-99)',
    guildOnly: true,
    async execute(msg, args) {
        //ERREUR ICI SI c'est en DM
        if(msg.member.hasPermission('MANAGE_MESSAGES')){
            // This command removes all messages from all users in the channel, up to 500.
            // get the delete count, as an actual number.
            const deleteCount = parseInt(args[0], 10)+1;

            // Ooooh nice, combined conditions. <3
            if(!deleteCount || deleteCount < 2 || deleteCount > 100)
                return msg.reply("Merci de donner un nombre de messages à supprimer entre 1 et 99 compris.");

            // So we get our messages, and delete them. Simple enough, right?
            const fetched = await msg.channel.fetchMessages({limit: deleteCount});
            msg.channel.bulkDelete(fetched)
                .then(function () {
                    msg.reply(deleteCount + " messages ont été supprimé !")
                        .then(sent => {
                            sent.delete(2000);
                        });
                })
                .catch(error => msg.reply(`Je n'ai pas réussi à supprimer les messages : ${error}`));
        }else{
            msg.reply('Malheuresement tu ne possèdes pas assez de permissions.')
        }
    },
};