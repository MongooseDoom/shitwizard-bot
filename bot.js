const Discord = require("discord.js");
const bot = new Discord.Client({ fetchAllMembers: true });
const config = require("./config.json");
const fs = require('fs');
const moment = require('moment');
const schedule = require('node-schedule');

const log = function(msg) {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${msg}`);
};

var j = schedule.scheduleJob({hour: 18, minute: 50, dayOfWeek: 3}, function(){
  if (config.raid === true) {
    bot.guilds.first().defaultChannel.sendMessage("@raid Raid starts in 10 min!");
    console.log('--- Raid Announcement ---');
  } else {
    bot.guilds.first().defaultChannel.sendMessage("@raid No raid this week! Go outside or something.");
    config.raid = true;
  }
});

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

bot.on("presenceUpdate", (oldMember, newMember) => {
  let guild = newMember.guild;
  let wow = guild.roles.find("name", "Playing WoW");
  let hots = guild.roles.find("name", "Playing HotS");
  let overwatch = guild.roles.find("name", "Playing Overwatch");
  if (!wow || !hots || !overwatch) {
    return;
  }

  // Set role for WoW
  if (newMember.user.presence.game && newMember.user.presence.game.name === "World of Warcraft") {
    newMember.addRole(wow);
  } else if (!newMember.user.presence.game && newMember.roles.has(wow.id)) {
    newMember.removeRole(wow);
  }
  // Set role for HotS
  if (newMember.user.presence.game && newMember.user.presence.game.name === "Heroes of the Storm") {
    newMember.addRole(hots);
  } else if (!newMember.user.presence.game && newMember.roles.has(hots.id)) {
    newMember.removeRole(hots);
  }
  // Set role for Overwatch
  if (newMember.user.presence.game && newMember.user.presence.game.name === "Overwatch") {
    newMember.addRole(overwatch);
  } else if (!newMember.user.presence.game && newMember.roles.has(overwatch.id)) {
    newMember.removeRole(overwatch);
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
