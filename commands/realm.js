const config = require('../config.json');
const request = require('request');

exports.run = function(bot, msg, args = []) {
  let realm = config.realm;
  if (args[0]) {
    realm = args[0];
  }
  request(`https://us.api.battle.net/wow/realm/status?locale=en_US&apikey=${process.env.BATTLENET_TOKEN}&realms=${realm}`, function(error, response, body){
    var data = JSON.parse(body);
    if (error || response.statusCode !== 200 || data.realms.length > 1) {
      console.log(error);
      msg.channel.sendMessage(`I can't check the status of ${realm}`);
    } else {
      if (data.realms[0].status) {
        msg.channel.sendMessage(`:white_check_mark: ${realm} is up`);
      } else {
        msg.channel.sendMessage(`:x: ${realm} is down`);
      }
    }
  });
};

exports.conf = {
  enabled: true,
  aliases: [],
};

exports.help = {
  name : 'realm',
  description: 'Returns WoW Realm Status',
  usage: `realm <realm - optional if on ${config.realm}>`
};
