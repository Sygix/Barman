module.exports = {
    name: 'poll',
    description: 'Créer un sondage, avec des réactions.',
    aliases: ['sondage', 'enquete'],
    usage: '(Question)',
    exemple: 'Quel est la couleur du soleil ?',
    cooldown: 15,
    args: true,
    guildOnly: true,
    hidden: false,
    category: 'Utilitaires',
    active: true,
    execute(msg, args) {
        var collectedA = new Array(); // Message
        var text = '';
        for(let i = 0; i < args.length; i++){
            text += args[i] + " ";
        }
        const embeb = new Discord.RichEmbed();

        msg.channel.send('Ajoutez le texte de votre réponse puis ajoutez la réactions associée, une réponse par message.\n' +
            'Cliquez sur  :heavy_check_mark: pour valider et :heavy_multiplication_x: pour annuler ! (Réponse(s) : 0)')
            .then(message => {
                message.react('✔');
                message.react('✖');

                const collector2 = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { errors: ['error'] });
                collector2.on('collect', messagee => {
                    collectedA.push(messagee);
                    message.edit('Ajoutez le texte de votre réponse puis ajoutez la réactions associée, une réponse par message.\n' +
                        'Cliquez sur  :heavy_check_mark: pour valider et :heavy_multiplication_x: pour annuler ! (Réponse(s) : '+ collectedA.length +')');

                });

                const filter = (reaction, user) => (reaction.emoji.name === '✔' || reaction.emoji.name === '✖')
                    && user.id === msg.member.id;
                const collector = message.createReactionCollector(filter, { time: 300000, errors: ['time'] });
                collector.on('collect', r => {
                    if(r.emoji.name === '✔'){
                        collectedA.forEach(messageee => {
                            embeb.addField(messageee, messageee.reactions.firstKey(), false);
                            console.log(messageee.reactions);
                        });
                        embeb.setTitle(`:bar_chart: Sondage : **${text}**`);
                        embeb.setColor(0x00AE86);
                        embeb.setFooter(`Sondage par ${msg.author.username}`);
                        msg.channel.send(embeb)
                            .then(sent => {
                                collectedA.forEach(messageee => {
                                    messageee.delete();
                                    sent.react(messageee.reactions.firstKey());
                                });
                            })
                            .catch(error => {
                                msg.channel.send('Une erreur s\'est produite.');
                                console.log(error);
                                });
                        message.delete();
                        msg.delete();
                        collector2.stop("success");
                        collector.stop("success");
                    }else{
                        msg.channel.send('Le sondage a été annulé !');
                        msg.delete();
                        collector2.stop("success/cancelled");
                        collector.stop("success/cancelled");
                    }
                });
                collector.on('end', reason => {
                    if(reason.array().length <= 0){
                        msg.channel.send("La requète a expiré ! (5 minutes)");
                    }
                });

            })
            .catch(error => {
                msg.channel.send("Une erreur s'est produite");
                console.log(error);
                return;
            });
    },
};