const p4Game = require('../../functions/puissance4Game');

module.exports = {
    name: 'puissance4',
    description: 'Jeu du puissance 4.',
    aliases: ['p4', 'connect4', 'c4'],
    usage: '[@user]',
    guildOnly: true,
    async execute(msg, args) {
        if(args.length < 1){
            var p4 = new p4Game(msg, msg.member);
            p4.start(['human', 'ai']);
        }else{
            msg.channel.send('Cette partie est encore en développement, patience !');
        }
    },
};