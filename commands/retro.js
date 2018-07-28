const RetroText = require('retrotext');

exports.run = function(bot, msg, args = []) {
  console.log(args);
  let lines = args.join(' ').split('|');
  let text = new RetroText().setBackgroundStyle(1).setTextStyle(4);
  
  if (lines[0]) { text.setLine1(lines[0]); }
  if (lines[1]) { text.setLine2(lines[1]); }
  if (lines[2]) { text.setLine3(lines[2]); }
    
  let URL = text.fetchURL().then((url) => {
    msg.channel.send(url);
    if (msg.deletable) {
      msg.delete().catch(console.error);
    }
  });
};

exports.conf = {
  enabled: true,
  aliases: [],
};

exports.help = {
  name : 'retro',
  description: 'Returns a retro image',
  usage: 'retro <line 1> | <line 2> | <line 3>'
};
