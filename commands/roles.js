const presence = require('../helpers/presence');

exports.run = function (bot, msg, args = []) {
  if (msg.author.username != 'MongooseDoom') { return; }

  let guild = bot.guilds.first();

  // Update member presence on ready
  guild.members.forEach(function (member) {
    presence.update(member);
  });
};

exports.conf = {
  enabled: true,
  aliases: [],
};

exports.help = {
  name: 'roles',
  description: 'Fixes channel rolls',
  usage: 'roles'
};
