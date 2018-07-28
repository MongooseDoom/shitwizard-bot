const affixes = require('../helpers/affixes.json');
const request = require('request');
const cheerio = require('cheerio');

exports.run = function(bot, msg, args = []) {
  request('http://www.wowhead.com', function(error, response, body){
    if (error || response.statusCode != 200) {
      throw new Error('Couldn\'t access mythic+ affixes.');
    }
    const $ = cheerio.load(body);
    let embed = {
      fields: [],
    };

    $('.tiw-region-US .tiw-group-mythicaffix tr .icon-both').each(function(i){
      let name = $(this).find('a').text().trim();
      let desc = 'http://www.wowhead.com'+$(this).find('a').attr('href');
      if (affixes[name].length) {
        desc = affixes[name];
      }

      embed.fields.push({
        name: name,
        value: desc
      });
    });

    msg.channel.sendMessage('', { embed });
  });
};

exports.conf = {
  enabled: true,
  aliases: ['affixes'],
};

exports.help = {
  name : 'mythic',
  description: 'Displays this week\'s mythic+ affixes for WoW',
  usage: 'mythic'
};
