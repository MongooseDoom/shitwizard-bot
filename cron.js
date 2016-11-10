const fs = require('fs');
const request = require("request");
const cheerio = require('cheerio');

request("http://www.wowhead.com", function(error, response, body){
  if (error || response.statusCode != 200) {
    throw new Error("Couldn't reach wowhead.com");
  }
  const $ = cheerio.load(body);
  var worldboss = $('.tiw-group-epiceliteworld .icon-both').eq(0).text();
  var worldbossLink = 'http://www.wowhead.com'+$('.tiw-group-epiceliteworld .icon-both a').eq(0).attr('href');

  fs.writeFile("./info.html", `${worldboss}\n${worldbossLink}`, function(err) {
      if(err) {
          return console.log(err);
      }

      console.log("--- The worldboss file was saved! ---");
  });
});
