const request = require('request');

module.exports = {
    name: 'weather',
    description: 'La météo en temps réel !',
    aliases: ['meteo', 'météo'],
    usage: '(ville,code pays) [Celsius/Fahrenheit]', //ADD 5days and 3hours previsions
    exemple: 'Los+Angeles,US, Fahrenheit',
    cooldown: 15,
    args: true,
    guildOnly: false,
    hidden: false,
    category: 'Informations',
    active: true,
    execute(msg, args) {
        let apiKey = process.env.WeatherKEY;
        let city = args[0].toLowerCase();
        let url = '';
        let unit = '';
        if(typeof args[1] !== "undefined" && args[1].toLowerCase() === 'fahrenheit'){
            url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&lang=fr&appid=${apiKey}`;
            unit = 'F'
        }else{
            url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=fr&appid=${apiKey}`;
            unit = 'C'
        }

        request(url, function (err, response, body) {
            if(err){
                console.log('error:', error);
                msg.channel.send("Une erreur s'est produite, réessayez plus tard !");
            } else {
                let weather = JSON.parse(body);
                try {
                    msg.channel.send(
                        {
                            "embed": {
                                "title": `Météo à ${weather.name}, ${weather.sys.country}`, "url": `https://openweathermap.org/city/${weather.id}`,
                                "color": 12678918,
                                "footer": {
                                    "text": "Météo par OpenWeatherMap"
                                },
                                "thumbnail": {
                                    "url": `http://openweathermap.org/img/w/${weather.weather[0].icon}.png`
                                },
                                "fields": [
                                    {
                                        "name": 'Météo',
                                        "value": `${weather.weather[0].description}`,
                                        "inline": true
                                    },
                                    {
                                        "name": "Température",
                                        "value": `${weather.main.temp} °${unit}`,
                                        "inline": true
                                    },
                                    {
                                        "name": "Humidité",
                                        "value": `${weather.main.humidity} %`,
                                        "inline": true
                                    },
                                    {
                                        "name": "Vent",
                                        "value": `${weather.wind.speed} m/s`,
                                        "inline": true
                                    },
                                    {
                                        "name": "Pression",
                                        "value": `${weather.main.pressure} hpa`,
                                        "inline": true
                                    }/*,
                                {
                                    "name": "Lever du soleil",
                                    "value": `${weather.sys.sunrise}`,
                                    "inline": true
                                }*/
                                ]
                            }
                        }
                    );
                }catch (e) {
                    msg.channel.send("Une erreur s'est produite / Cette ville n'existe pas !");
                }
            }
        });
    },
};