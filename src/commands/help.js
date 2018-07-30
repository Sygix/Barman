const { prefix } = require('../../config.json');

module.exports = {
    name: 'help',
    description: 'Liste de toutes les commandes ou infos à propos d\'une commande particulère.',
    aliases: ['commands', 'aide', 'command'],
    usage: 'help [command]',
    cooldown: 5,
    execute(msg, args) {

        const data = [];
        const { commands } = msg.client;

        if (!args.length) {
            data.push('Liste des commandes disponible :');
            data.push('\`\`\`Markdown\n    - '+commands.map(command => command.name).join(',\n    - '));
            data.push(`\n\`\`\`Vous pouvez écrire ${prefix}\`help [command name]\` pour avoir plus d'infos sur une commande particulière !\n`);
            data.push("Informations complémentaire et aide disponible sur ce discord : http://discord.gg/JMXbw4E \n" +
                "() = champ obligatoire | [] = champ optionnel | Bot by Sygix#3290");

            return msg.channel.send(data, { split: true });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return msg.reply('Cette commande n\'existe pas !');
        }

        data.push(`**Nom:** ${command.name}`);

        if (command.aliases) data.push(`**Alias:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Utilisation:** ${prefix}${command.name} ${command.usage}`);
        if(command.cooldown) data.push(`**Cooldown:** ${command.cooldown} seconde(s)`);

        msg.channel.send(data, { split: true });

        /*
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
            "() = champ obligatoire | [] = champ optionnel | Bot by Sygix#3290");*/
    },
};