module.exports = class createTempVoiceChannel {

    static create(channel, member, guild, members, number, everyone = false){ //Parfois le channel ne se créer pas dans la bonne catégorie / A vérifier les .then
        guild.createChannel(member.displayName, 'voice', [{
            id: member.user,
            allow: ['CONNECT', 'SPEAK', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS'],
        }])
            .then(function (cchannel) {
                for(let i = 0; i < members.length; i++){
                    if(members[i].user === bot.user){}else{
                        cchannel.overwritePermissions(members[i].user, {
                            CONNECT: true,
                            SPEAK: true
                        });
                    }
                }
                if(everyone === true){
                    cchannel.overwritePermissions(guild.defaultRole , { //add @everyone perms
                        CONNECT: true,
                        SPEAK: true
                    });
                }
                cchannel.setParent(guild.channels.find('name', 'Temporaire')); //create in category temp
                if(number > 0 && number < 100){
                    cchannel.setUserLimit(number);
                }
                tempChannels.set(member.id, cchannel.id);
                member.setVoiceChannel(cchannel);
                channel.send('Le channel a été créé, vous avez été déplacé !');
            })
            .catch(console.error);
    }

    static createWithoutMSG(member, guild){
        guild.createChannel(member.displayName, 'voice', [{
            id: member.user,
            allow: ['CONNECT', 'SPEAK', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS'],
        }])
            .then(function (cchannel) {
                cchannel.overwritePermissions(guild.defaultRole , { //add @everyone perms
                    CONNECT: true,
                    SPEAK: true
                });
                cchannel.setParent(guild.channels.find('name', 'Temporaire')); //create in category temp
                tempChannels.set(member.id, cchannel.id);
                member.setVoiceChannel(cchannel);
                member.createDM()
                    .then(function (dm) {
                        dm.send('Le channel a été créé sur le discord **'+guild.name+'**, vous avez été déplacé !');
                        dm.delete();
                    })
                    .catch(console.error);
            })
            .catch(console.error);
    }

};