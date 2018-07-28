const config = require('../config.json');
const toon = require('../helpers/toon');

const classColors = [ 'c69b6d', 'f48cba', 'aad372', 'fff468', 'ffffff', 'c41e3b', '2359ff', '68ccef', '9382c9', '00ffba', 'ff7c0a'];

exports.run = function(bot, msg, args = []) {
  let realm = config.realm;
  if (args[1]) {
    realm = args[1];
  }

  toon.get(args[0], realm, 'items,professions').then((character) => {
    let embed = {
      color: parseInt(classColors[character.class - 1], 16),
      author: {
        name: `${character.name} - ${character.realm}`,
        url: `https://worldofwarcraft.com/en-us/character/${character.realm}/${character.name}`
      },
      thumbnail: {
        url: `http://render-us.worldofwarcraft.com/character/${character.thumbnail}`,
        width: 84,
        height: 84,
      },
      timestamp: new Date(character.lastModified),
      footer: {
        text: 'last updated'
      },
      fields: [
        {
          name: 'ilvl',
          value: character.items.averageItemLevelEquipped,
        },
        {
          name: 'Professions',
          value: `${character.professions.primary[0].name} (${character.professions.primary[0].rank}) and ${character.professions.primary[1].name} (${character.professions.primary[1].rank})`,
        },
        {
          name: 'Head',
          value: `${character.items.head.itemLevel}  [${character.items.head.name}](http://www.wowhead.com/item=${character.items.head.id})`,
          inline: true,
        },
        {
          name: 'Neck',
          value: `${character.items.neck.itemLevel}  [${character.items.neck.name}](http://www.wowhead.com/item=${character.items.neck.id})`,
          inline: true,
        },
        {
          name: 'Shoulder',
          value: `${character.items.shoulder.itemLevel}  [${character.items.shoulder.name}](http://www.wowhead.com/item=${character.items.shoulder.id})`,
          inline: true,
        },
        {
          name: 'Back',
          value: `${character.items.back.itemLevel}  [${character.items.back.name}](http://www.wowhead.com/item=${character.items.back.id})`,
          inline: true,
        },
        {
          name: 'Chest',
          value: `${character.items.chest.itemLevel}  [${character.items.chest.name}](http://www.wowhead.com/item=${character.items.chest.id})`,
          inline: true,
        },
        {
          name: 'Wrist',
          value: `${character.items.wrist.itemLevel}  [${character.items.wrist.name}](http://www.wowhead.com/item=${character.items.wrist.id})`,
          inline: true,
        },
        {
          name: 'Hands',
          value: `${character.items.hands.itemLevel}  [${character.items.hands.name}](http://www.wowhead.com/item=${character.items.hands.id})`,
          inline: true,
        },
        {
          name: 'Waist',
          value: `${character.items.waist.itemLevel}  [${character.items.waist.name}](http://www.wowhead.com/item=${character.items.waist.id})`,
          inline: true,
        },
        {
          name: 'Legs',
          value: `${character.items.legs.itemLevel}  [${character.items.legs.name}](http://www.wowhead.com/item=${character.items.legs.id})`,
          inline: true,
        },
        {
          name: 'Feet',
          value: `${character.items.feet.itemLevel}  [${character.items.feet.name}](http://www.wowhead.com/item=${character.items.feet.id})`,
          inline: true,
        },
        {
          name: 'Finger 1',
          value: `${character.items.finger1.itemLevel}  [${character.items.finger1.name}](http://www.wowhead.com/item=${character.items.finger1.id})`,
          inline: true,
        },
        {
          name: 'Finger 2',
          value: `${character.items.finger2.itemLevel}  [${character.items.finger2.name}](http://www.wowhead.com/item=${character.items.finger2.id})`,
          inline: true,
        },
        {
          name: 'Trinket 1',
          value: `${character.items.trinket1.itemLevel}  [${character.items.trinket1.name}](http://www.wowhead.com/item=${character.items.trinket1.id})`,
          inline: true,
        },
        {
          name: 'Trinket 2',
          value: `${character.items.trinket2.itemLevel}  [${character.items.trinket2.name}](http://www.wowhead.com/item=${character.items.trinket2.id})`,
          inline: true,
        },
        {
          name: 'Main Hand',
          value: `${character.items.mainHand.itemLevel}  [${character.items.mainHand.name}](http://www.wowhead.com/item=${character.items.mainHand.id})`,
          inline: true,
        },
      ],
    };
    if (character.items.offHand) {
      embed.fields.push({
        name: 'Off Hand',
        value: `${character.items.offHand.itemLevel}  [${character.items.offHand.name}](http://www.wowhead.com/item=${character.items.offHand.id})`,
        inline: true,
      });
    }
    msg.channel.sendMessage('', { embed });
  }, (error) => {
    msg.channel.sendMessage(`Sorry, I couldn't find ${args[0]}-${realm}`);
  });
};

exports.conf = {
  enabled: true, // not used yet
  aliases: [],
};

exports.help = {
  name : 'who',
  description: 'Returns detailed information about a WoW character',
  usage: `who <name> <realm - optional if on ${config.realm}>`
};
