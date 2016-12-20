const config = require("../config.json");
const request = require("request");
const cheerio = require('cheerio');

exports.run = function(bot, msg, args = []) {
  request("http://www.wowhead.com", function(error, response, body){
    if (error || response.statusCode != 200) {
      throw new Error("Couldn't access mythic+ affixes.");
      return;
    }
    const $ = cheerio.load(body);
    var embed = {
      fields: [],
    };

    $('.tiw-region-US .tiw-group-mythicaffix tr .icon-both').each(function(i){
      var name = $(this).find('a').text();
      var url = 'http://www.wowhead.com'+$(this).find('a').attr('href');

      embed.fields.push({
        name: name,
        value: url
      });
    });

    msg.channel.sendMessage('', { embed });
  });
};

exports.conf = {
  enabled: true, // not used yet
  aliases: [],
};

exports.help = {
  name : "mythic",
  description: "Displays this week's mythic+ affixes for WoW",
  usage: "mythic"
};
