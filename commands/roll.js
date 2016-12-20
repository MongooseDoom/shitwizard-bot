function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

exports.run = function(bot, msg, args = []) {
  let max = 100;
  if (args[0]) {
    max = args[0];
  }

  msg.reply(`${getRandomInt(1,max)}`);
};

exports.conf = {
  enabled: true, // not used yet
  aliases: [],
};

exports.help = {
  name : "roll",
  description: "Returns a random number from 1-100 or from 1 to provided max",
  usage: "roll <max number>"
};
