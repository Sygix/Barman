const { prefix } = require('../../config.json');

module.exports = {
    name: 'help',
    description: 'Liste de toutes les commandes ou infos à propos d\'une commande.',
    aliases: ['commands', 'aide', 'command'],
    usage: '[command]',
    exemple: 'weather',
    active: true,
    cooldown: 5,
    category: 'Informations',
    execute(msg, args) {

        const data = [];
        const { commands } = msg.client;

        if (!args.length) {
            let embedMessage = {
                embed: {
                    "title": ":books: Aide sur les commandes :books:",
                    "description": "Informations détaillées pour chaque commande avec `@Barman help commande`\n" +
                    "[Besoin d'un peu plus d'aide ? Rejoignez le discord en cliquant sur ce texte !](https://discord.gg/zgMKGT4)",
                    "url": "https://discordapp.com/oauth2/authorize?client_id=417683933891919882&permissions=1610083447&scope=bot",
                    "color": 12390624,
                    "fields": []
                }
            };
            commands.map(command => {
                if(!command.hidden){
                    if(typeof command.category === 'undefined'){
                        command.category = 'Autre';
                    }
                    if(embedMessage.embed.fields.length <= 0){
                        embedMessage.embed.fields.push({
                            "name": command.category,
                            "value": "`"+command.name+"` | *"+command.description+"*\n"
                        });
                    }else{
                        for(i = 0; i < embedMessage.embed.fields.length; i++){
                            let element = embedMessage.embed.fields[i];
                            if(element.name === command.category && !element.value.includes(command.name)){
                                element.value += "`"+command.name+"` | *"+command.description+"*\n";
                                return;
                            }
                        }
                        embedMessage.embed.fields.push({
                            "name": command.category,
                            "value": "`"+command.name+"` | *"+command.description+"*\n"
                        });
                    }
                }
            });

            return msg.channel.send(embedMessage);
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