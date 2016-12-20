const config = require("../config.json");
const toon = require("../helpers/toon");

exports.run = function(bot, msg, args = []) {
  let realm = config.realm;
  if (args[1]) {
    realm = args[1];
  }

  toon.get(args[0], realm, 'items').then((character) => {
    msg.channel.sendMessage(`${args[0]}-${realm} ilvl is ${character.items.averageItemLevelEquipped}`);
  }, (error) => {
    console.log(error);
    msg.channel.sendMessage(`Sorry, I couldn't find ${args[0]}-${realm}`);
  });
};

exports.conf = {
  enabled: true,
  aliases: [],
};

exports.help = {
  name : "ilvl",
  description: "Returns WoW character's ilevel",
  usage: `ilvl <name> <realm - optional if on ${config.realm}>`
};
