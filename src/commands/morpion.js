const morpionGame = require('../functions/morpionGame');

module.exports = {
    name: 'morpion',
    description: 'Jeu du Morpion/TicTacToe.',
    aliases: ['tictactoe'],
    usage: '[@user]',
    exemple: '@Sygix',
    active: true,
    guildOnly: true,
    async execute(msg, args) {
        if(args.length < 1){
            var morpion = new morpionGame(msg, msg.member);
            morpion.start(['human', 'ai']);
        }else{
            if(msg.mentions.members.array().length > 1){
                if(msg.guild.members.has(msg.mentions.members.array()[1].id)){
                    var player1 = msg.member;
                    var player2 = msg.mentions.members.array()[1];
                    if(player2 === player1)return;
                    if(player2.user === bot.user) return;
                    if(player2.user.bot) return;


                    var morpion = new morpionGame(msg, player1, player2);
                    morpion.start(['human', 'human']);
                }
            }else if(msg.mentions.members.array().length = 1){
                if(msg.guild.members.has(msg.mentions.members.array()[0].id)){
                    var player1 = msg.member;
                    var player2 = msg.mentions.members.array()[0];
                    if(player2 === player1)return;
                    if(player2.user === bot.user) return;
                    if(player2.user.bot) return;


                    var morpion = new morpionGame(msg, player1, player2);
                    morpion.start(['human', 'human']);
                }
            }else return;
        }
    },
};