const { prefix } = require('../config.json');

module.exports = {
  enabled: true,
  guildOnly: false,
  name: 'help',
  description: 'List all of my commands or info about a specific command.',
  aliases: ['commands'],
  execute(message, args) {
    const data = [];
    const { commands } = message.client;

    // Send the whole list of commands if no arguments were provided
    if (!args.length) {
      return message.channel.send(
        `= Command List =\n\n[Use ${prefix}help <commandname> for details]\n\n${commands
          .filter(c => c.enabled == true)
          .map(c => `${c.name}: ${c.description}`)
          .join('\n')}`,
        { code: 'asciidoc', split: true },
      );
    }

    // Get the command
    const name = args[0].toLowerCase();
    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

    if (!command) {
      return message.reply("That's not a valid command!");
    }

    // Create the help message for a single command
    data.push(`= ${command.name} = \n${command.description}\n`);

    if (command.usage) {
      data.push(`usage: ${prefix}${command.usage}`);
    }

    message.channel.send(data, { code: 'asciidoc', split: true });
  },
};
