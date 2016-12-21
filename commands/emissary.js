const request = require('request');
const cheerio = require('cheerio');

exports.run = function(bot, msg, args = []) {
  request('http://www.wowhead.com', function(error, response, body){
    if (error || response.statusCode != 200) {
      throw new Error('Couldn\'t access emissary info.');
    }
    const $ = cheerio.load(body);
    var embed = {
      fields: [],
    };

    $('.tiw-region-US .tiw-group-wrapper-emissary .tiw-heading').each(function(i){
      var name = $(this).find('th a').text().trim();
      var url = 'http://www.wowhead.com'+$(this).find('th a').attr('href');
      var time = $(this).find('.tiw-line-ending-short').text().trim();

      embed.fields.push({
        name: `${name} (${time})`,
        value: url
      });
    });

    msg.channel.sendMessage('', { embed });
  });
};

exports.conf = {
  enabled: true, // not used yet
  aliases: ['emmisary', 'emmissary'],
};

exports.help = {
  name : 'emissary',
  description: 'Displays this week\'s emissary quests for WoW',
  usage: 'emissary'
};
