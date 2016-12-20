const config = require("../config.json");
const toon = require("../helpers/toon");

exports.run = function(bot, msg, args = []) {
  let realm = config.realm;
  if (args[1]) {
    realm = args[1];
  }

  toon.get(args[0], realm, 'professions').then((character) => {
    let professions = '';
    if (character.professions.primary.length === 2) {
      msg.channel.sendMessage(`${args[0]}-${realm} professions are: ${character.professions.primary[0].name} (${character.professions.primary[0].rank}) and ${character.professions.primary[1].name} (${character.professions.primary[1].rank})`);
    } else if (character.professions.primary.length === 1) {
      msg.channel.sendMessage(`${args[0]}-${realm} professions are: ${character.professions.primary[0].name} (${character.professions.primary[0].rank}) and that's it because ${args[0]} is lazy!`);
    } else {
      msg.channel.sendMessage(`${args[0]}-${realm} has no professions :cold_sweat:`);
    }
  }, (error) => {
    msg.channel.sendMessage(`Sorry, I couldn't find ${args[0]}-${realm}`);
  });
};

exports.conf = {
  enabled: true, // not used yet
  aliases: ["professions"],
};

exports.help = {
  name : "prof",
  description: "Returns WoW character's professions",
  usage: `prof <name> <realm - optional if on ${config.realm}>`
};
