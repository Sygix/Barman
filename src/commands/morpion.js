const morpionGame = require('../functions/morpionGame');

module.exports = {
    name: 'morpion',
    description: 'Jeu du Morpion/TicTacToe.',
    aliases: ['tictactoe'],
    usage: '[@user]',
    guildOnly: true,
    async execute(msg, args) {
        if(args.length < 1){
            var morpion = new morpionGame(msg, msg.member);
            morpion.start(['human', 'ai']);
        }else{
            var player1 = msg.member;
            var player2 = msg.mentions.members.array()[0];
            if(player2 === player1)return;

            var morpion = new morpionGame(msg, player1, player2);
            morpion.start(['human', 'human']);
            /*if(msg.mentions.members.array().length <= 0)return;
            if(msg.guild.members.get(msg.mentions.members.array()[0].id)){
                var player1 = msg.member;
                var player2 = msg.mentions.members.array()[0];
                if(player2 === player1)return;

                var morpion = new morpionGame(msg, player1, player2);
                morpion.start(['human', 'human']);
            }*/
        }
    },
};