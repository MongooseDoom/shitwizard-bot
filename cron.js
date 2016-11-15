const fs = require('fs');
const request = require("request");
const cheerio = require('cheerio');

request("http://www.wowhead.com", function(error, response, body){
  if (error || response.statusCode != 200) {
    throw new Error("Couldn't reach wowhead.com");
  }
  const $ = cheerio.load(body);
  var data = {};

  // Worldboss
  if ($('.tiw-region-US .tiw-group-epiceliteworld').length > 0) {
    data.worldboss = {
        name: $('.tiw-region-US .tiw-group-epiceliteworld .icon-both').text(),
        url: 'http://www.wowhead.com'+$('.tiw-region-US .tiw-group-epiceliteworld .icon-both a').eq(0).attr('href'),
    }
  }

  // Emissary
  data.emissary = [];
  $('.tiw-region-US .tiw-group').each(function(i){
    if (i <= 2) {
      data.emissary.push({
        name: $(this).find('b a').text(),
        url: 'http://www.wowhead.com'+$(this).find('b a').attr('href'),
      });
    }
  });

  fs.writeFile(require('path').resolve(__dirname, 'info.json'), JSON.stringify(data), function(err) {
      if(err) {
          return console.log(err);
      }

      console.log("--- The info file was saved! ---");
  });
});
