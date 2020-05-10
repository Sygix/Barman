module.exports = {
    name: 'ping',
    description: 'Ping!',
    active: true,
    cooldown: 10,
    category: 'Informations',
    async execute(msg, args) {
        const message = await msg.channel.send(`:ping_pong: Pinging....`);

        message.edit(`:ping_pong: Pong!
        La latence est de ${Math.floor(message.createdTimestamp - msg.createdTimestamp)}ms
        La latence API est de ${Math.round(bot.ping)}ms`);
    },
};