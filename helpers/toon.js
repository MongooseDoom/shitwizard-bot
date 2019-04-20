const request = require('request');

const get = function (character, realm, fields){
  return new Promise((resolve, reject) => {
    request(`https://us.api.blizzard.com/wow/character/${realm}/${character}?fields=${fields}&locale=en_US&access_token=${process.env.BATTLENET_TOKEN}`, function(error, response, body){
      if (error) { reject(error); }
      if (response.statusCode !== 200) { reject(new Error('Expected statusCode === 200')); }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
};

module.exports.get = get;
