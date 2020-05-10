module.exports = {
    name: 'invite',
    description: 'Invite moi sur ton serveur discord.',
    active: true,
    guildOnly: true,
    cooldown: 10,
    category: 'Informations',
    execute(msg, args) {
        msg.member.createDM()
            .then(function (dm) {
                dm.send('Hey, tu souhaites m\'ajouter sur ton discord ? Pas de soucis clique sur le lien ci-dessous, à tout de suite :blush:\n' +
                    'https://bit.ly/2HpxUrB');
                dm.delete();
            })
            .catch(console.error);
        msg.channel.send("Je t'ai envoyé le lien d'invitation, regarde tes messages privés :smiley:");
    },
};