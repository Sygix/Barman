module.exports = {
    name: 'setupvoice',
    description: 'Configuration du serveur pour accepter les channels temporaire.',
    aliases: ['voicesetup'],
    cooldown: 10,
    execute(msg, args) {
        msg.channel.send("Commande en cours de codage...");
    },
};