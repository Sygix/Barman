module.exports = {
    name: 'ping',
    description: 'Ping!',
    cooldown: 10,
    execute(msg, args) {
        msg.channel.send('pong :ping_pong:');
    },
};