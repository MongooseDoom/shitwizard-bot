const request = require('request');
const cheerio = require('cheerio');

exports.run = function(bot, msg, args = []) {
  request('http://www.wowhead.com', function(error, response, body){
    if (error || response.statusCode != 200) {
      throw new Error('Couldn\'t access world boss info.');
    }
    const $ = cheerio.load(body);
    var embed = {
      fields: [],
    };

    $('.tiw-region-US .tiw-group-epiceliteworld').each(function(){
      var name = $(this).find('.icon-both a').text().trim();
      var url = 'http://www.wowhead.com'+$(this).find('.icon-both a').attr('href');

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
  name : 'worldboss',
  description: 'Displays this week\'s worldboss for WoW',
  usage: 'worldboss'
};
