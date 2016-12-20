exports.run = function(bot, msg, args = []) {
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
};

exports.conf = {
  enabled: true, // not used yet
  aliases: [],
};

exports.help = {
  name : "shitwizard",
  description: "Shitwizard makes some...noises...",
  usage: "shitwizard"
};
