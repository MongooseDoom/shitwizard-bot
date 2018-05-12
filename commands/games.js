const request = require('request');
const moment = require('moment');
var table = require('markdown-table');
const { URL, URLSearchParams } = require('url');

const apiURL = new URL("https://www.giantbomb.com/api/games/");
const exclude_platforms = ['IPHN', 'IPAD', 'ANDR', 'LIN'];

exports.run = function(bot, msg, args = []) {
  const today = moment();
  const params = new URLSearchParams();
  
  params.append('api_key', process.env.GIANTBOMB_TOKEN);
  params.append('field_list', 'deck,expected_release_month,expected_release_day,expected_release_year,name,platforms,site_detail_url');
  params.append('sort', 'expected_release_day:desc');
  params.append('filter', `filter=expected_release_year:${today.format('YYYY')},expected_release_month:${today.format('M')}`);
  params.append('format', 'json');
  
  request.get(
    {
      url: `${apiURL}?${params}`,
      json: true,
      headers: { 'User-Agent': 'request' }
    },
    (err, res, data) => {
      if (err) {
        console.log('Error:', err);
      } else if (res.statusCode !== 200) {
        console.log('Status:', res.statusCode);
      } else {
        console.log(data);
        let list = [['Date', 'Name','Platforms']];
        data.results.forEach(game => {
          if (game.expected_release_year && game.expected_release_month && game.expected_release_day) {
            list.push([
              `${game.expected_release_year}/${game.expected_release_month}/${game.expected_release_day}`,
              game.name.substring(0, 40),
              game.platforms
              .filter(p => exclude_platforms.indexOf(p.abbreviation) == -1)
              .map(p => p.abbreviation)
                .join(',')
            ]);
          }
        });
        msg.channel.send(table(list), {
          code: 'asciidoc',
          split: true,
        });
      }
    }
  );
};

exports.conf = {
  enabled: true, // not used yet
  aliases: []
};

exports.help = {
  name: 'games',
  description: 'Displays this month\'s video game releases',
  usage: 'games'
};
