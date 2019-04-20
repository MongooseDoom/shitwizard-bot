exports.run = function(bot, msg, args = []) {
  const voiceChannel = msg.member.voiceChannel;
  if (bot.guilds.first().voiceConnection) {
    return msg.reply(`Yes, yes, thank you. I'm busy right now.`);
  }
  if (!voiceChannel) {
    return msg.reply(`Please be in a voice channel first!`);
  }
  voiceChannel.join()
   .then(connection => {
     const dispatcher = connection.playFile('./audio/robes.mp3').on('end', () => {
       voiceChannel.leave();
     });
   })
   .catch(console.error);
};

exports.conf = {
  enabled: true,
  aliases: [],
};

exports.help = {
  name : 'thanks',
  description: 'Shitwizard is very grateful (must be in voice channel)',
  usage: 'thanks'
};
