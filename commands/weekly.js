const request = require('request');
const cheerio = require('cheerio');

exports.run = function(bot, msg, args = []) {
  request('http://www.wowhead.com', function(error, response, body){
    if (error || response.statusCode != 200) {
      throw new Error('Couldn\'t access world event info.');
    }
    const $ = cheerio.load(body);
    var embed = {
      fields: [],
    };

    $('.tiw-region-US .tiw-group-holiday .tiw-heading').each(function(i){
      var name = $(this).find('th a').text().trim();
      var url = 'http://www.wowhead.com'+$(this).find('th a').attr('href');

      embed.fields.push({
        name: `${name}`,
        value: url
      });
    });

    msg.channel.sendMessage('', { embed });
  });
};

exports.conf = {
  enabled: true, // not used yet
  aliases: ['weekly'],
};

exports.help = {
  name : 'world',
  description: 'Displays this week\'s world events for WoW',
  usage: 'world'
};
