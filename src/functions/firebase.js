var admin = require("firebase-admin");
const firebaseCert = require("../ressources/firebaseCert");

module.exports = {
    connectFirebase: function() {
        admin.initializeApp({
            credential: admin.credential.cert(
                firebaseCert.s3
            ),
            databaseURL: 'https://barman-29f46.firebaseio.com/'
        });
        console.log("Connected to Firebase");
    },

    updateServers: function() {
        var db = admin.database();
        var ref = db.ref("servers");
        return new Promise(function(reject) {
                bot.guilds.array().forEach(server => {
                    var serverID = ref.child(server.id);
                    serverID.set({
                        name: server.name,
                        ownerID: server.ownerID,
                        ownerTag: server.owner.user.tag,
                        channels: server.channels.array().length
                    }, function(error) {
                        if (error) {
                            reject(error);
                        }
                    });
                })
            }
        );
    },

    updateXP: function(userID) {
        var db = admin.database();
        var ref = db.ref("levels/"+userID+"/xp");
        var xp = 0;
        ref.transaction(function(currentXP) {
            // If xp has never been set, currentXP will be `null`.
            return (currentXP || 0) + 1;
        });
    },

    updateLVL: function(userID, lvl) {
        var db = admin.database();
        var ref = db.ref("levels/"+userID+"/level");
        ref.transaction(function(currentLVL) {
            // If level has never been set, currentLVL will be `null`.
            if(currentLVL < lvl){
                return (currentLVL || 0) + 1;
            }else return currentLVL;
        });
    }

    /*getFromFirebase: function() {
        var db = admin.database();
        var ref = db.ref("servers");
        ref.once("value", snap => {
            console.log(snap.child('291817674894344193').val());
        });
    }*/
};