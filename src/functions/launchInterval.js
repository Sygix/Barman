module.exports = function launchInterval(){

    setInterval(function () {
        bot.channels.get('417391359423545355').send('dlm!bump');
        bot.channels.get('417391359423545355').send(';;bump');
    }, 22200000);
    setInterval(function () {
        bot.channels.get('417391359423545355').send('=bump');
    }, 15000000);

};