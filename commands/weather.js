const config = require("../config.json");
const request = require("request");

exports.run = function(bot, msg, args = []) {
  let location = args.join(" ");
  let query = 'q';

  let firstChar = location.charAt(0);
  if (!isNaN(parseInt(firstChar))) {
    query = 'zip';
  }

  request(`http://api.openweathermap.org/data/2.5/weather?${query}=${location}&units=imperial&APPID=${process.env.WEATHER_TOKEN}`, function(error, response, body){
    if (error || response.statusCode != 200) {
      throw new Error(`Couldn't access weather for ${location}.`);
      return;
    }
    var data = JSON.parse(body);

    var embed = {
      thumbnail: {
        url: `http://openweathermap.org/img/w/${data.weather[0].icon}.png`,
        width: 50,
        height: 50,
      },
      fields: [
        {
          name: `${data.weather[0].main} - ${data.weather[0].description}`,
          value: `${data.main.temp}°F, temperature from ${data.main.temp_min} to ${data.main.temp_max}°F`,
        },
      ],
      footer: {
        text: `${data.name}, ${data.sys.country}`,
      }
    };

    msg.channel.sendMessage('', { embed });
  });
};

exports.conf = {
  enabled: true,
  aliases: [],
};

exports.help = {
  name : "weather",
  description: "Returns the weather by city or zip",
  usage: "weather [city,country or zip]"
};
