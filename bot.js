const fs = require('fs');
const Discord = require('discord.js');
const { prefix } = require('./config.json')

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
  console.log('Shitwizard is ready! 😎');
});

client.on('message', message => {
  // Exit if the message has no prefix or is from a bot
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // Get arguments
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // Get the command
  const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  // Exit if the command doesn't exist
  if (!command) return;

  // Check if the command should only be used in guilds
  if (command.guildOnly && message.channel.type === 'dm') {
    return message.reply('I can\'t execute that command inside DMs!');
  }

  // Check if the command requires arguments
  if (command.args && !args.length) {
    return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
  }

  // Execute the command
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.channel.send(`I'm sorry ${message.author}, I'm afraid I can't do that.`);
  }
});

// login to Discord with your app's token
client.login(process.env.DISCORD_TOKEN);