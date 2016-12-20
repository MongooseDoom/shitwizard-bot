const Discord = require("discord.js");
const bot = new Discord.Client({ fetchAllMembers: true });
const config = require("./config.json");
const fs = require('fs');
const moment = require('moment');

// const request = require("request");
// const schedule = require('node-schedule');
// const fs = require('fs');
// const moment = require('moment');
// const cheerio = require('cheerio');


const log = function(msg) {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${msg}`);
};

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

// Load in all commands in ./commands
fs.readdir('./commands/', function(err, files){
  if (err) console.error(err);
  log(`Loading a total of ${files.length} commands.`);
  files.forEach(function(f){
    let props = require(`./commands/${f}`);
    log(`Loading Command: ${props.help.name}.`);
    bot.commands.set(props.help.name, props);
    props.conf.aliases.forEach(function(alias){
      bot.aliases.set(alias, props.help.name);
    });
  });
});

bot.on('message', function(msg){
  // Exit if message is from a bot
  if(msg.author.bot) return;

  // Exit if no prefix
  if(!msg.content.startsWith(config.prefix)) return;

  // Log what was used
  log(`${msg.author.username} used "${msg.content}"`);

  // Get command
  let command = msg.content.split(" ")[0];
  command = command.slice(config.prefix.length);

  // Get arguments
  let args = msg.content.split(" ").slice(1);

  let cmd;

  // Check if bot has command
  if (bot.commands.has(command)) {
    cmd = bot.commands.get(command);
  } else if (bot.aliases.get(command)) {
    cmd = bot.commands.get(bot.aliases.get(command));
  }

  // Run command
  if (cmd) {
    cmd.run(bot, msg, args);
  }
});


bot.on('ready', () => {
  log(`Shitwizard is ready! 😎 \n`);
});

bot.on('disconnect', () => {
  log('Disconnected! 😭');
});

bot.on('reconnecting', () => {
  log('Reconnecting...');
});

bot.on('error', e => { console.error(e); });

bot.login(process.env.DISCORD_TOKEN);
