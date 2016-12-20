exports.run = function(bot, msg, args = []) {
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
};

exports.conf = {
  enabled: true, // not used yet
  aliases: [],
};

exports.help = {
  name : "thanks",
  description: "Shitwizard is very grateful (must be in voice channel)",
  usage: "thanks"
};