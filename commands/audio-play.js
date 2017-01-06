const yt = require('ytdl-core');
const display = require('../helpers/display-o-tron');

exports.run = function(bot, msg, args = []) {
  const musicChannel = bot.guilds.first().channels.find('name','Lounge');
  musicChannel.join()
   .then(function(connection){
     let stream = yt(args[0], {audioonly: true});
     stream.on('info', function(info, format){
       display.write(['Playing Youtube', info.title], [255, 241, 109]);
     });
     const dispatcher = connection.playStream(stream);
     dispatcher.on('end', () => {
       musicChannel.leave();
     });
   })
   .catch(console.error);
};

exports.conf = {
  enabled: true, // not used yet
  aliases: [],
};

exports.help = {
  name : 'play',
  description: 'Play audio from youtube (must be in Lounge channel)',
  usage: 'play'
};
