module.exports = function launchInterval(){

    setInterval(function () {
        bot.channels.get('417391359423545355').send('dlm!bump');
        bot.channels.get('417391359423545355').send('!disboard bump');
    }, 22200000);

};