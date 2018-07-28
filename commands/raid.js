const config = require('../config.json');
const moment = require('moment');

let raid = config.raid;

exports.run = function(bot, msg, args = []) {
  let raidCmd = args[0];
  let raidTime = moment().day(3).hour(19);

  if (raidCmd === 'remind') {
    let raidRole = msg.guild.roles.find('name', 'Raid');
    if (msg.member.roles.has(raidRole.id)) {
      msg.member.removeRole(raidRole);
      msg.reply(`I won't notify you of raid announcements`);
    } else {
      msg.member.addRole(raidRole);
      msg.reply(`Okay, I will notify you of raid announcements`);
    }
  }

  if (raidCmd === 'set' && msg.author.username === 'MongooseDoom') {
    if (args[1]) {
      raid = args[1];
      msg.author.sendMessage(`raid is now ${raid}`);
    } else {
      msg.reply('Please include a boolean value to set raid to. Example: `!raid set true`');
    }

  }

  if (raidCmd === 'get' && msg.author.username === 'MongooseDoom') {
    msg.author.sendMessage(`raid is ${raid}`);
  }

  if (!raidCmd) {
    if (raid) {
      msg.channel.sendMessage(`Raid is ${moment().to(raidTime)}`);
    } else {
      msg.channel.sendMessage('No raid this week.\n');
    }
  }
};

exports.conf = {
  enabled: false,
  aliases: [],
};

exports.help = {
  name : 'raid',
  description: 'Check next raid time or set a raid reminder',
  usage: 'raid\nraid remind\n'
};
