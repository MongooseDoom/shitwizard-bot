const config = require('../config.json');

exports.run = (bot, msg, params) => {
  if (!params[0]) {
    msg.channel.sendCode('asciidoc', `= Command List =\n\n[Use ${config.prefix}help <commandname> for details]\n\n${bot.commands.filter(c=>c.conf.enabled == true).map(c=>`${c.help.name}: ${c.help.description}`).join('\n')}`);
  } else {
    let command = params[0];
    if(bot.commands.has(command)) {
      command = bot.commands.get(command);
      msg.channel.sendCode('asciidoc', `= ${command.help.name} = \n${command.help.description}\nusage: ${config.prefix}${command.help.usage}`);
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name : 'help',
  description: 'Displays a list of all the commands shitwizard knows',
  usage: 'help [command]'
};
