module.exports = {
    name: 'maths',
    description: 'Calcule pour toi :smile:',
    aliases: ['math'],
    args: true,
    active: false, //Need to patch eval breach
    usage: '(calcul)',
    exemple: '2+2',
    execute(msg, args) {
        try {
            msg.channel.send(eval(args[0]) + ":nerd:");
        } catch (e) {
            msg.channel.send("Je ne comprend pas ce calcul ! :cry:");
        }
    },
};