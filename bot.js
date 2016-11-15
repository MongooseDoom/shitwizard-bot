const Discord = require("discord.js");
const request = require("request");
const fs = require('fs');
const config = require("./config.json");

const bot = new Discord.Client();
const responses = {
  "!hello": ":sunglasses:",
};

function getCharacter(character, realm, fields){
  return new Promise((resolve, reject) => {
    request(`https://us.api.battle.net/wow/character/${realm}/${character}?fields=${fields}&locale=en_US&apikey=${config.api}`, function(error, response, body){
      if (error) { reject(error); }
      if (response.statusCode !== 200) { reject(new Error('Expected statusCode === 200')); }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}

bot.on("message", msg => {

  // Exit if no prefix
  if(!msg.content.startsWith(config.prefix)) return;
  // Exit if message is from a bot
  if(msg.author.bot) return;

  // Get command
  let command = msg.content.split(" ")[0];
  command = command.slice(config.prefix.length);
  console.log(`${msg.author.username} used "${msg.content}"`);

  // Get arguments
  let args = msg.content.split(" ").slice(1);

  // Get ilvl
  if (command === "ilvl" || command === "ilevel") {
    let realm = config.realm;
    if (args[1]) {
      realm = args[1];
    }

    getCharacter(args[0], realm, 'items').then((character) => {
      msg.channel.sendMessage(`${args[0]}-${realm} ilvl is ${character.items.averageItemLevelEquipped}`);
    }, (error) => {
      msg.channel.sendMessage(`Sorry, I couldn't find ${args[0]}-${realm}`);
    });

    return;
  }

  // Get professions
  if (command === "prof" || command === "professions") {
    let realm = config.realm;
    if (args[1]) {
      realm = args[1];
    }

    getCharacter(args[0], realm, 'professions').then((character) => {
      let professions = '';
      if (character.professions.primary.length === 2) {
        msg.channel.sendMessage(`${args[0]}-${realm} professions are: ${character.professions.primary[0].name} (${character.professions.primary[0].rank}) and ${character.professions.primary[1].name} (${character.professions.primary[1].rank})`);
      } else if (character.professions.primary.length === 1) {
        msg.channel.sendMessage(`${args[0]}-${realm} professions are: ${character.professions.primary[0].name} (${character.professions.primary[0].rank}) and that's it because ${args[0]} is lazy!`);
      } else {
        msg.channel.sendMessage(`${args[0]}-${realm} has no professions :cold_sweat:`);
      }
    }, (error) => {
      msg.channel.sendMessage(`Sorry, I couldn't find ${args[0]}-${realm}`);
    });

    return;
  }

  if (command === "worldboss") {
    fs.readFile('./info.json', (err, data) => {
      data = JSON.parse(data);
      if (err) {
        console.log(err);
        msg.channel.sendMessage("I can't load world info right now.");
      } else if (data.worldboss === undefined) {
        msg.channel.sendMessage("World boss info is not available right now");
      } else {
        msg.channel.sendMessage(`${data.worldboss.name} - ${data.worldboss.url}`);
      }
      return;
    });
  }

  if (command === "emissary") {
    fs.readFile('./info.json', (err, data) => {
      data = JSON.parse(data);
      if (err) {
        console.log(err);
        msg.channel.sendMessage("I can't load world info right now.");
      } else if (data.emissary.length === 0) {
        msg.channel.sendMessage("Emissary info is not available right now");
      } else {
        var message = "";
        for (var i = 0; i < data.emissary.length; i++) {
          message += `${data.emissary[i].name} - ${data.emissary[i].url}\n`;
        }
        msg.channel.sendMessage(message);
      }
      return;
    });
  }

  if (command === "realm") {
    let realm = config.realm;
    if (args[0]) {
      realm = args[0];
    }
    request(`https://us.api.battle.net/wow/realm/status?locale=en_US&apikey=${config.api}&realms=${realm}`, function(error, response, body){
      var data = JSON.parse(body);
      if (error || response.statusCode !== 200 || data.realms.length > 1) {
        console.log(error);
        msg.channel.sendMessage(`I can't check the status of ${realm}`);
      } else {
        if (data.realms[0].status) {
          msg.channel.sendMessage(`:white_check_mark: ${realm} is up`);
        } else {
          msg.channel.sendMessage(`:x: ${realm} is down`);
        }
      }
    });
    return;
  }

  if (command === "help") {
    msg.channel.sendMessage(`
\`\`\`
Character Commands:
  structure: !<command> [name] [realm - optional if on ${config.realm}]
  ilvl          Returns character's ilevel
  prof          Returns character's professions
\`\`\`
\`\`\`
Basic Commands:
  structure: !<command> [arguments]
  help          Shows all the commands that shitwizard knows
  worldboss     Shows the world boss for this week
  emissary      Shows the current emissary quests
  realm [realm] Shows realm status
\`\`\`
Example of a command:
\`\`\`
!ilvl Maralina
!ilvl Marama Blackrock
\`\`\`
Submit an issue: https://github.com/MongooseDoom/discord-shirley/issues
`);
  }

  // For simple responses
  if(responses[msg.content]) {
    msg.channel.sendMessage(responses[msg.content]);
  }

});

bot.on('ready', () => {
  console.log('I\'m ready! 😎');
});

bot.on('disconnect', () => {
  console.log('Disconnected! 😭');
});

bot.on('reconnecting', () => {
  console.log('Reconnecting...');
});

bot.on('error', e => { console.error(e); });

bot.login(process.env.DISCORD_TOKEN);
