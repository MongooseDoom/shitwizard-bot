const yt = require('ytdl-core');
const display = require('../helpers/display-o-tron');

var queue = [];

exports.run = function(bot, msg, args = []) {
  // Clear queue
  if (args[0] == 'clear') {
    queue = [];
  }

  // Add video to queue
  queue.push(args[0]);

  // Return if bot is already playing music
  if (bot.guilds.first().voiceConnection) { return; }

  // Start playing music
  const musicChannel = bot.guilds.first().channels.find('name','Lounge');

  function play(connection){
    // If queue is empty, leave channel
    if (!queue.length) {
      display.write(['Finished Youtube', 'queue'], [255, 241, 109]);
      musicChannel.leave();
      return;
    }

    let stream = yt(queue[0], {audioonly: true});
    // Get stream info
    stream.on('info', function(info, format){
      display.write(info.title, [255, 241, 109]);
      if (info.length_seconds > 600) {
        queue.shift();
        play(connection);
      }
      // Start playing stream
      const dispatcher = connection.playStream(stream);
      // Remove from queue when finished and then start playing again
      dispatcher.on('end', () => {
        queue.shift();
        play(connection);
      });
    });

  }

  musicChannel.join()
   .then(function(connection){
     play(connection);
   })
   .catch(console.error);
};

exports.conf = {
  enabled: true,
  aliases: [],
};

exports.help = {
  name : 'play',
  description: 'Play audio from youtube (must be in Lounge channel)',
  usage: 'play'
};
