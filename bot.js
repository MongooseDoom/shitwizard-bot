var Discord = require("discord.js");
var bot = new Discord.Client();

const prefix = "!";
var responses = {
  "!ping": "pong!",
};

bot.on("message", msg => {

  // Exit if no prefix
  if(!msg.content.startsWith(prefix)) return;
  // Exit if message is from a bot
  if(msg.author.bot) return;

  if(responses[msg.content]) {
    msg.channel.sendMessage(responses[msg.content]);
  }

});

bot.on('guildMemberAvailable', (member) => {
  console.log(`"${member.user.username}" has become available. whatever that means.` );
});

bot.on('ready', () => {
  console.log('I am ready!');
});

bot.on('error', e => { console.error(e); });

bot.login("TOKEN");
