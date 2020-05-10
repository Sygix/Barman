const firebase = require('../functions/firebase');

module.exports = {
    name: 'level',
    description: 'Ton niveau sur tous les serveurs ou le bot est présent.',
    aliases: ['xp', 'lvl', 'px'],
    usage: '[@user]',
    exemple: '@Sygix#3290',
    cooldown: 30,
    args: false,
    guildOnly: false,
    hidden: false,
    category: 'Informations',
    active: true,
    async execute(msg, args) {
        firebase.getLevelFromFirebase(msg.author.id, (snap) => {
            msg.reply("Votre xp : "+snap.val().xp+"\n Votre level : "+snap.val().level);
        });
    },
};