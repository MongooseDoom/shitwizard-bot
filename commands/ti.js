const { SlashCommandBuilder } = require('@discordjs/builders');
const races = require('../helpers/ti-races.json');
const maxPlayers = 8;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ti')
    .addIntegerOption(option => option.setName('numofplayers').setDescription('Number of players').setRequired(true))
    .addIntegerOption(option => option.setName('numofchoices').setDescription('Number of choices').setRequired(true))
    .addBooleanOption(option => option.setName('basiconly').setDescription('Use basic options only?').setRequired(false))
    .setDescription('Creates a random list of Twilight Imperium races for players to choose from.'),
  async execute(interaction) {
    // Set arguments
    const numOfPlayers = interaction.options.getInteger('numofplayers');
    const numOfChoices = interaction.options.getInteger('numofchoices') || 1;
    const basicOnly = interaction.options.getBoolean('basiconly');

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
      interaction.reply(`Twilight Imperium supports a max of ${maxPlayers} players`);
      return;
    }
    if (numOfPlayers * numOfChoices > raceList.length) {
      interaction.reply(`There aren't enough races to support that many choices per player`);
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
    await interaction.reply(`${playerOptionList.map((c, i) => `= Player ${i + 1} =\n${c.join('\n')}`).join('\n\n')}`, {
      code: 'asciidoc',
      split: true,
    });
  },
};