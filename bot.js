const Discord = require("discord.js");
const request = require("request");

const api = 'txsqd8scedz7z3922rc2cnsx26mz5n55';
const bot = new Discord.Client();
const prefix = "!";
var responses = {
  "!hello": ":sunglasses:",
};

bot.on("message", msg => {

  // Exit if no prefix
  if(!msg.content.startsWith(prefix)) return;
  // Exit if message is from a bot
  if(msg.author.bot) return;

  // Get ilvl
  if (msg.content.startsWith(prefix + "ilvl")) {
    let args = msg.content.split(" ").slice(1);
    let realm = 'Tichondrius';
    if (args[1]) {
      realm = args[1];
    }

    request(`https://us.api.battle.net/wow/character/${realm}/${args[0]}?fields=items&locale=en_US&apikey=${api}`, function(error, response, body){
      if (!error && response.statusCode == 200) {
        var character = JSON.parse(body);
        msg.channel.sendMessage(`${args[0]}-${realm} ilvl is ${character.items.averageItemLevelEquipped}`);
      } else {
        msg.channel.sendMessage(`Sorry, I couldn't find ${args[0]}-${realm}`);
      }
    });

    return;
  }

  // For simple responses
  if(responses[msg.content]) {
    msg.channel.sendMessage(responses[msg.content]);
  }

  // Logging
  console.log(`${msg.author.username} used ${msg.content}`);

});

bot.on('ready', () => {
  console.log('I\'m ready! 😎');
});

bot.on('disconnect', () => {
  console.log('Disconnected! 😭');
});

bot.on('error', e => { console.error(e); });

bot.login(process.env.DISCORD_TOKEN);
