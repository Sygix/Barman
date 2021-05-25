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

    closeFirebase: function() {
        admin.database().goOffline();
        console.log("Disconnected from Firebase");
    },

    updateServers: function() {
        var db = admin.database();
        var ref = db.ref("servers");
        return new Promise(function(reject) {
                bot.guilds.cache.each(server => {
                    var serverID = ref.child(server.id);
                    serverID.update({
                        name: server.name,
                        ownerID: server.ownerID,
                        channels: server.channels.cache.size,
                        memberCount: server.memberCount
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
            //(userID, currentXP);
            return (currentXP || 0) + 1;
        });
    },

    updateLVL: function(userID, XP, callback) {
        var db = admin.database();
        var ref = db.ref("levels/"+userID+"/level");
        ref.transaction(function(currentLVL) {
            // If level has never been set, currentLVL will be `null`.
            const newLvl = Math.floor(0.1 * Math.sqrt(XP));
            if(currentLVL < newLvl){
                return (currentLVL || 0) + 1;
            }else return currentLVL;
        });
    },

    getLevelFromFirebase: function(UserID, callback) {
        var db = admin.database();
        db.ref('/levels/' + UserID).once('value').then(callback);
    },

    updatePrefix: function(serverID, newprefix) {
        var db = admin.database();
        var ref = db.ref("/servers/" + serverID + "/prefix");
        ref.transaction((oldprefix) => {
            return newprefix;
        });
    },

    getServerSettings: function(serverID) {
        var db = admin.database();
        return db.ref('/servers/' + serverID).once('value');
    },

    cacheMap: function (map, collection) {
        var db = admin.database();
        var ref = db.ref('/cache/'+collection);
        const obj = Object.fromEntries(map);
        return new Promise(function(reject) {
            ref.update(obj, function(error) {
                if (error) {
                    reject(error)
                }
            });
        });
    },

    //NEED TO CLEAN UNNECESSARY CODE & FUNCTIONS

    set: function (path, value) {
        var db = admin.database();
        var ref = db.ref(path);
        return new Promise(function(reject) {
            ref.set(value, function(error) {
                if (error) {
                    reject(error)
                }
            });
        });
    },

    get: function (path) {
        var db = admin.database();
        return db.ref(path).once('value');
    },

    delete: function (path) {
        var db = admin.database();
        return db.ref(path).remove();
    }
};
