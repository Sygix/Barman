const morpionGame = require('../functions/morpionGame');

module.exports = {
    name: 'morpion',
    description: 'Jeu du Morpion/TicTacToe.',
    aliases: ['tictactoe'],
    guildOnly: true,
    async execute(msg, args) {
        if(args.length < 1){
            var morpion = new morpionGame(msg, msg.member);
            morpion.start(['human', 'ai']);
        }else{
            msg.channel.send('Cette partie est encore en développement, patience !');
        }
    },
};