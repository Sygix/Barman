const firebase = require('../functions/firebase');

module.exports = {
    name: 'level',
    description: 'Get your cross servers level',
    aliases: ['xp', 'lvl', 'px'],
    usage: '[@user]',
    exemple: '@Sygix#3290',
    cooldown: 30,
    args: false,
    guildOnly: false,
    hidden: false,
    category: 'Level',
    active: true,
    async execute(msg, args) {
        firebase.getLevelFromFirebase(msg.author.id, (snap) => {
            msg.reply("Votre xp : "+snap.val().xp+"\n Votre level : "+snap.val().level);
        });
    },
};