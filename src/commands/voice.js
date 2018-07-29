const createTVC = require('../functions/createTempVoiceChannel');

module.exports = {
    name: 'voice',
    description: 'Créer un channel vocal temporaire.',
    aliases: ['voix'],
    args: true,
    usage: '(0-99) [public / @user @user]',
    guildOnly: true,
    execute(msg, args) {
        if(msg.member.voiceChannel != null && !tempChannels.has(msg.member.id)){
            if(args[1] === 'public'){
                createTVC.create(msg.channel, msg.member, msg.guild, msg.mentions.members.array(), args[0], true);
            }else {
                createTVC.create(msg.channel, msg.member, msg.guild, msg.mentions.members.array(), args[0]);
            }
        }else{
            msg.channel.send("Vous devez être connecté à un channel vocal/Vous avez déjà un channel vocal.");
        }
    },
};