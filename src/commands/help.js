const { prefix } = require('../../config.json');

module.exports = {
    name: 'help',
    description: 'Liste de toutes les commandes ou infos à propos d\'une commande particulère.',
    aliases: ['commands', 'aide', 'command'],
    usage: '[command]',
    exemple: 'weather',
    active: true,
    cooldown: 5,
    execute(msg, args) {

        const data = [];
        const { commands } = msg.client;

        if (!args.length) {
            data.push('Liste des commandes disponible :');
            data.push('\`\`\`Markdown\n');
            commands.map(command => {
                if(!command.hidden) data.push('    - '+command.name);
            });
            data.push(`\n\`\`\`Vous pouvez écrire ${prefix}\`help [command name]\` pour avoir plus d'infos sur une commande particulière !\n`);
            data.push("Informations complémentaire et aide disponible sur ce discord : https://discord.gg/zgMKGT4 \n" +
                "() = champ obligatoire | [] = champ optionnel | Bot by Sygix#3290");

            return msg.channel.send(data, { split: true });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command || command.hidden === true || command.active === false) {
            return msg.reply('Cette commande n\'existe pas !');
        }

        data.push(`**Nom:** ${command.name}`);

        if (command.aliases) data.push(`**Alias:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Utilisation:** ${prefix}${command.name} ${command.usage}`);
        if (command.exemple) data.push(`**Exemple:** ${prefix}${command.name} ${command.exemple}`);
        if (command.cooldown) data.push(`**Cooldown:** ${command.cooldown} seconde(s)`);
        if (command.category) data.push(`**Catégorie:** ${command.category}`);

        msg.channel.send(data, { split: true });
    },
};