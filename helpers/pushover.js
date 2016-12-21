const Message = require('pushover-promise').Message;

const send = function (message) {
  const user = process.env.PUSHOVER_USER;
  const token = process.env.PUSHOVER_TOKEN;

  const msg = new Message(user, token);

  msg.push(message)
  .then(console.log)
  .catch(console.error);
};

module.exports.send = send;
