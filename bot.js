const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { prefix } = require('./config.json');
const display = require('./helpers/display-o-tron');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command);
}

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
  console.log('Shitwizard is ready! 😎');
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (!client.commands.has(interaction.commandName)) return;

  try {
    await client.commands.get(interaction.commandName).execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

// login to Discord with your app's token
client.login(process.env.DISCORD_TOKEN);
