const races = require('../helpers/ti-races.json');
const maxPlayers = 6;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = {
  enabled: true,
  guildOnly: false,
  args: true,
  name: 'ti',
  description: 'Creates a random list of Twilight Imperium races for players to choose from.',
  usage: 'ti <number of players> <number of choices> <optional: basic>',
  execute(message, args) {
    // Set arguments
    const numOfPlayers = parseInt(args[0]);
    const numOfChoices = args[1] ? parseInt(args[1]) : 1;
    const basicOnly = args[2] == 'basic' ? true : false;

    // Create a list with the chosen attribute to track when a race has already been chosen
    const raceArray = races.races;
    let raceList = raceArray;

    if (basicOnly) {
      raceList = raceArray.filter(race => {
        race.type == 'basic';
      });
    }

    raceList.forEach(race => {
      race.chosen = false;
    });

    // Create a list to return
    let playerOptionList = [];

    // Check to make sure the user has not selected more than 6 players or more than 3 choices
    if (numOfPlayers > maxPlayers) {
      msg.reply('Twilight Imperium supports a max of 6 players');
      return;
    }
    if (numOfPlayers * numOfChoices > raceList.length) {
      msg.reply(`There aren't enough races to support that many choices per player`);
      return;
    }

    // Function that returns a random race
    function getRandomRace() {
      let race = false;

      while (race == false) {
        const random = getRandomInt(0, raceList.length);
        if (raceList[random].chosen == false) {
          race = raceList[random];
          raceList[random].chosen = true;
        }
      }

      return race;
    }

    for (var i = 1; i <= numOfPlayers; i++) {
      let playerLimit = 0;
      let playerOptions = [];

      while (playerLimit < numOfChoices) {
        playerOptions.push(getRandomRace().name);
        playerLimit++;
      }

      playerOptionList.push(playerOptions);
    }

    // Send message with player choices
    message.channel.send(`${playerOptionList.map((c, i) => `= Player ${i + 1} =\n${c.join('\n')}`).join('\n\n')}`, {
      code: 'asciidoc',
      split: true,
    });
  },
};
