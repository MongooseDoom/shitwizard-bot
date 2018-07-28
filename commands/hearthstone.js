var unirest = require('unirest');

const rarity = [
  'Free', 'Common', 'Rare', 'Epic', 'Legendary'
];
const rarityColors = [
  '808080', // free
  'ffffff', // common
  '0070DD', // rare
  'A335EE', // epic
  'FF8000', // legendary
];

exports.run = function(bot, msg, args = []) {
  let name = args.join(' ');

  unirest.get(`https://omgvamp-hearthstone-v1.p.mashape.com/cards/search/${name}`)
  .header('X-Mashape-Key', process.env.MASHAPE_TOKEN)
  .end(function (result) {
    let card = result.body[0];
    let colorIndex = rarity.findIndex(function(item){
      return item == card.rarity;
    });

    let embed = {
      color: parseInt(rarityColors[colorIndex], 16),
      image: {
        url: card.img,
      },
      fields: [
        {
          name: 'Set',
          value: card.cardSet,
          inline: true,
        },
        {
          name: 'Class',
          value: card.playerClass,
          inline: true,
        },
      ],
      footer: {
        text: card.flavor
      }
    };

    if (card.howToGet) {
      embed.fields.push({
        name: 'How to get',
        value: card.howToGet
      });
    }


    msg.channel.sendMessage('', { embed });
  });
};

exports.conf = {
  enabled: true,
  aliases: ['hearthstone'],
};

exports.help = {
  name : 'hs',
  description: 'Displays information for a hearthstone card',
  usage: 'hs <cardname>'
};
