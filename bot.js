const Discord = require("discord.js");
const request = require("request");
const schedule = require('node-schedule');
const fs = require('fs');
const config = require("./config.json");

const bot = new Discord.Client();
const responses = {
  "!hello": ":sunglasses:",
};
var announce = true;
const classColors = [ "c69b6d", "f48cba", "aad372", "fff468", "ffffff", "c41e3b", "2359ff", "68ccef", "9382c9", "00ffba", "ff7c0a"];

var j = schedule.scheduleJob({hour: 18, minute: 50, dayOfWeek: 3}, function(){
  if (announce === true) {
    bot.guilds.first().defaultChannel.sendMessage("It's probably raid time. I dunno.");
    console.log('--- Raid Announcement ---');
  } else {
    announce = true;
  }
});

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

  if (command === "emissary" || command === "emmisary" || command === "emmissary" ) {
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

  if (command === "raid") {
    if (msg.author.username === "MongooseDoom") {
      announce = args[0];
      msg.channel.sendMessage(`announce is now ${announce}`);
    }
    return;
  }

  if (command === "thanks") {
    const voiceChannel = msg.member.voiceChannel;
    if (voiceChannel) {
      voiceChannel.join()
       .then(connection => {
         connection.playFile('./robes.mp3').on('end', () => {
           voiceChannel.leave();
         });
       })
       .catch(console.error);
    }
  }

  if (command === "who") {
    let realm = config.realm;
    if (args[1]) {
      realm = args[1];
    }

    getCharacter(args[0], realm, 'items,professions').then((character) => {
      let embed = {
        color: parseInt(classColors[character.class - 1], 16),
        author: {
          name: `${character.name} - ${character.realm}`,
          url: `http://us.battle.net/wow/en/character/${character.realm}/${character.name}/simple`
        },
        thumbnail: {
          url: `http://render-api-us.worldofwarcraft.com/static-render/us/${character.thumbnail}`,
          width: 84,
          height: 84,
        },
        timestamp: new Date(character.lastModified),
        footer: {
          text: 'last updated'
        },
        fields: [
          {
            name: 'ilvl',
            value: character.items.averageItemLevelEquipped,
          },
          {
            name: 'Professions',
            value: `${character.professions.primary[0].name} (${character.professions.primary[0].rank}) and ${character.professions.primary[1].name} (${character.professions.primary[1].rank})`,
          },
          {
            name: "Head",
            value: `${character.items.head.itemLevel}  [${character.items.head.name}](http://www.wowhead.com/item=${character.items.head.id})`,
            inline: true,
          },
          {
            name: "Neck",
            value: `${character.items.neck.itemLevel}  [${character.items.neck.name}](http://www.wowhead.com/item=${character.items.neck.id})`,
            inline: true,
          },
          {
            name: "Shoulder",
            value: `${character.items.shoulder.itemLevel}  [${character.items.shoulder.name}](http://www.wowhead.com/item=${character.items.shoulder.id})`,
            inline: true,
          },
          {
            name: "Back",
            value: `${character.items.back.itemLevel}  [${character.items.back.name}](http://www.wowhead.com/item=${character.items.back.id})`,
            inline: true,
          },
          {
            name: "Chest",
            value: `${character.items.chest.itemLevel}  [${character.items.chest.name}](http://www.wowhead.com/item=${character.items.chest.id})`,
            inline: true,
          },
          {
            name: "Wrist",
            value: `${character.items.wrist.itemLevel}  [${character.items.wrist.name}](http://www.wowhead.com/item=${character.items.wrist.id})`,
            inline: true,
          },
          {
            name: "Hands",
            value: `${character.items.hands.itemLevel}  [${character.items.hands.name}](http://www.wowhead.com/item=${character.items.hands.id})`,
            inline: true,
          },
          {
            name: "Waist",
            value: `${character.items.waist.itemLevel}  [${character.items.waist.name}](http://www.wowhead.com/item=${character.items.waist.id})`,
            inline: true,
          },
          {
            name: "Legs",
            value: `${character.items.legs.itemLevel}  [${character.items.legs.name}](http://www.wowhead.com/item=${character.items.legs.id})`,
            inline: true,
          },
          {
            name: "Feet",
            value: `${character.items.feet.itemLevel}  [${character.items.feet.name}](http://www.wowhead.com/item=${character.items.feet.id})`,
            inline: true,
          },
          {
            name: "Finger 1",
            value: `${character.items.finger1.itemLevel}  [${character.items.finger1.name}](http://www.wowhead.com/item=${character.items.finger1.id})`,
            inline: true,
          },
          {
            name: "Finger 2",
            value: `${character.items.finger2.itemLevel}  [${character.items.finger2.name}](http://www.wowhead.com/item=${character.items.finger2.id})`,
            inline: true,
          },
          {
            name: "Trinket 1",
            value: `${character.items.trinket1.itemLevel}  [${character.items.trinket1.name}](http://www.wowhead.com/item=${character.items.trinket1.id})`,
            inline: true,
          },
          {
            name: "Trinket 2",
            value: `${character.items.trinket2.itemLevel}  [${character.items.trinket2.name}](http://www.wowhead.com/item=${character.items.trinket2.id})`,
            inline: true,
          },
          {
            name: "Main Hand",
            value: `${character.items.mainHand.itemLevel}  [${character.items.mainHand.name}](http://www.wowhead.com/item=${character.items.mainHand.id})`,
            inline: true,
          },
        ],
      };
      if (character.items.offHand) {
        embed.fields.push({
          name: "Off Hand",
          value: `${character.items.offHand.itemLevel}  [${character.items.offHand.name}](http://www.wowhead.com/item=${character.items.offHand.id})`,
          inline: true,
        })
      }
      msg.channel.sendMessage('', { embed });
    }, (error) => {
      msg.channel.sendMessage(`Sorry, I couldn't find ${args[0]}-${realm}`);
    });

    // let embed = {
    //   color: 3447003,
    //   author: {
    //     name: msg.author.username,
    //     icon_url: msg.author.avatarURL // eslint-disable-line camelcase
    //   },
    //   description: '\nThis is a test embed to showcase what they look like and what they can do.\n[Code here](https://github.com/vzwGrey/discord-selfbot/blob/master/commands/embed.js)',
    //   fields: [
    //     {
    //       name: 'Fields',
    //       value: 'They can have different fields with small headlines.'
    //     },
    //     {
    //       name: 'Masked links',
    //       value: 'You can put [masked](https://github.com/vzwGrey/discord-selfbot/blob/master/commands/embed.js) links inside of rich embeds.'
    //     },
    //     {
    //       name: 'Markdown',
    //       value: 'You can put all the *usual* **__Markdown__** inside of them.'
    //     }
    //   ],
    //   timestamp: new Date(),
    //   footer: {
    //     icon_url: msg.author.avatarURL, // eslint-disable-line camelcase
    //   }
    // };
    //
    // msg.channel.sendMessage('', { embed });
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
  thanks        Shitwizard is very grateful (must be in voice channel)
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
