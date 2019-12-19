module.exports = function msToTime(duration){

    let seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24)
        , days = parseInt((duration/(1000*60*60*60))%7);

    days = (days < 10) ? "0" + days : days;
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    if(minutes <= 0){
        return seconds + "s";
    }else if(hours <= 0){
        return minutes + ":" + seconds;
    } else if(days <= 0){
        return hours + ":" + minutes + ":" + seconds + "s";
    } else {
        return days + " jours " + hours + ":" + minutes + ":" + seconds + "s";
    }

};