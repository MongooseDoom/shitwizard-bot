const display = require('../helpers/display-o-tron');

exports.run = function(bot, msg, args = []) {
  let displayMessage = args.join(' ');

  if (args[0] == 'reset') {
    display.reset();
  } else if (args[0] == 'color') {
    display.changeColor(parseInt(args[1]), parseInt(args[2]), parseInt(args[3]));
  } else {
    display.write(displayMessage);
  }
};

exports.conf = {
  enabled: true, // not used yet
  aliases: [],
};

exports.help = {
  name : 'display',
  description: 'Update shitwizard\'s display',
  usage: 'display <message>'
};
