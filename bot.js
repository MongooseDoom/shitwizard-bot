const Discord = require("discord.js");
const request = require("request");
const schedule = require('node-schedule');
const fs = require('fs');
const config = require("./config.json");
const moment = require('moment');
const cheerio = require('cheerio');

const bot = new Discord.Client();
const responses = {
  "!hello": ":sunglasses:",
};
var raid = true;
const classColors = [ "c69b6d", "f48cba", "aad372", "fff468", "ffffff", "c41e3b", "2359ff", "68ccef", "9382c9", "00ffba", "ff7c0a"];

var j = schedule.scheduleJob({hour: 18, minute: 50, dayOfWeek: 3}, function(){
  if (raid === true) {
    bot.guilds.first().defaultChannel.sendMessage("@raid Raid starts in 10 min!");
    console.log('--- Raid Announcement ---');
  } else {
    bot.guilds.first().defaultChannel.sendMessage("@raid No raid this week! Go outside or something.");
    raid = true;
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

bot.on("message", msg => {

  // Exit if message is from a bot
  if(msg.author.bot) return;

  // Exit if no prefix
  if(!msg.content.startsWith(config.prefix)) return;

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
    request("http://www.wowhead.com", function(error, response, body){
      if (error || response.statusCode != 200) {
        throw new Error("Couldn't access world boss info.");
        return;
      }
      const $ = cheerio.load(body);
      var embed = {
        fields: [],
      };

      $('.tiw-region-US .tiw-group-epiceliteworld').each(function(i){
        var name = $(this).find('.icon-both a').text();
        var url = 'http://www.wowhead.com'+$(this).find('.icon-both a').attr('href');

        embed.fields.push({
          name: name,
          value: url
        });
      });

      msg.channel.sendMessage('', { embed });
    });
  }

  if (command === "emissary" || command === "emmisary" || command === "emmissary" ) {
    request("http://www.wowhead.com", function(error, response, body){
      if (error || response.statusCode != 200) {
        throw new Error("Couldn't access emissary info.");
        return;
      }
      const $ = cheerio.load(body);
      var embed = {
        fields: [],
      };

      $('.tiw-region-US .tiw-group-wrapper-emissary .tiw-heading').each(function(i){
        var name = $(this).find('th a').text();
        var url = 'http://www.wowhead.com'+$(this).find('th a').attr('href');
        var time = $(this).find('.tiw-line-ending-short').text();

        embed.fields.push({
          name: `${name} (${time})`,
          value: url
        });
      });

      msg.channel.sendMessage('', { embed });
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
    let raidCmd = args[0];
    let raidTime = moment().day(3).hour(19);

    if (raidCmd === 'remind') {
      let raidRole = msg.guild.roles.find("name", "Raid");
      if (msg.member.roles.has(raidRole.id)) {
        msg.member.removeRole(raidRole);
        msg.reply(`I won't notify you of raid announcements`);
      } else {
        msg.member.addRole(raidRole);
        msg.reply(`Okay, I will notify you of raid announcements`);
      }
    }

    if (raidCmd === 'set' && msg.author.username === "MongooseDoom") {
      if (args[1]) {
        raid = args[1];
        msg.author.sendMessage(`raid is now ${announce}`);
      } else {
        msg.reply('Please include a boolean value to set raid to. Example: `!raid set true`');
      }

    }

    if (!raidCmd) {
      if (raid) {
        msg.channel.sendMessage(`Raid is ${moment().to(raidTime)}`);
      } else {
        msg.channel.sendMessage('No raid this week.\n');
      }
    }

    return;
  }

  if (command === "thanks") {
    const voiceChannel = msg.member.voiceChannel;
    if (!voiceChannel) {
      return msg.reply(`Please be in a voice channel first!`);
    }
    voiceChannel.join()
     .then(connection => {
       connection.playFile('./audio/robes.mp3').on('end', () => {
         voiceChannel.leave();
       });
     })
     .catch(console.error);
  }

  if (command === "shitwizard") {
    const voiceChannel = msg.member.voiceChannel;
    if (!voiceChannel) {
      return msg.reply(`Please be in a voice channel first!`);
    }
    voiceChannel.join()
     .then(connection => {
       connection.playFile('./audio/shitwizard.mp3').on('end', () => {
         voiceChannel.leave();
       });
     })
     .catch(console.error);
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
  }

  if (command === "help") {
    msg.channel.sendMessage(`
\`\`\`
Character Commands:
  structure: !<command> [name] [realm - optional if on ${config.realm}]
  ilvl            Returns character's ilevel
  prof            Returns character's professions
  who             Returns detailed character information
\`\`\`
\`\`\`
Basic Commands:
  structure: !<command> [arguments]
  help            Shows all the commands that shitwizard knows
  worldboss       Shows the world boss for this week
  emissary        Shows the current emissary quests
  realm [realm]   Shows realm status
  thanks          Shitwizard is very grateful (must be in voice channel)
\`\`\`
\`\`\`
Raid Commands:
  structure: !raid <command> [arguments]
  raid            Let you know when the next raid is
  raid remind     Will notify you of raid announcements
  raid set        Set whether there is a raid next week or not. (Needs permissions)

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
  console.log(`I'm ready! 😎 \nraid is set to ${raid}`);
});

bot.on('disconnect', () => {
  console.log('Disconnected! 😭');
});

bot.on('reconnecting', () => {
  console.log('Reconnecting...');
});

bot.on('error', e => { console.error(e); });

bot.login(process.env.DISCORD_TOKEN);
