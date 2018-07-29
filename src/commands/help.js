module.exports = {
    name: 'help',
    description: 'Liste de toutes les commandes ou infos à propos d\'une commande particulère.',
    aliases: ['commands', 'aide', 'command'],
    usage: '[command name]',
    cooldown: 10,
    execute(msg, args) {
        msg.channel.send("--- Liste des commandes disponible : ---\n" +
            "  - @Barman help\n" +
            "  - @Barman ping\n" +
            "  - @Barman maths (calcul)\n" +
            "  - @Barman ia (message)\n" +
            "  - @Barman voice (0-99) [public / @user @user]\n" +
            "  - @Barman morpion [@user]\n" +
            "  - SOON @Barman loupgarou\n" +
            //"  - SOON @Barman r6s (pseudo) [uplay, xone, ps4] [op/saison]\n" +
            "  - @Barman clear (1-99)\n" +
            "  - @Barman stats\n" +
            "  - @Barman invite\n" +
            "Informations complémentaire et aide disponible sur ce discord : http://discord.gg/JMXbw4E \n" +
            "() = champ obligatoire | [] = champ optionnel | Bot by Sygix#3290");
    },
};