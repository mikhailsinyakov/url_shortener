const express = require('express');
const app = express();
const port = process.env.PORT;
//const mongo = require("mongodb").MongoClient;
const mongoConnect = require("./mongoConnect");


app.use(express.static('public'));

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

mongoConnect((err, db) => {
  if (err) console.error("Can't access to database");
  const collection = db.db("short_urls").collection("short_urls");
  const validUrl = /https?:\/\/(www.)?[\w]+.[\w]{2,5}(\/[\w\?=&-]+)*$/;
  const validNewRequest = new RegExp(/^/ + "/new" + validUrl);
  console.log()
  app.get(/^\/new\/[\S]+$/, (req, res) => {
      const query = req.url.slice(5);
      const validUrl = /^https?:\/\/(www.)?[\w]+.[\w]{2,5}(\/[\w\?=&-]+)*$/;
      const validQuery = new RegExp("/new" + validUrl)
      console.log(validQuery)
      if (query.match(validUrl)) {
        const url = query;
        collection.find().toArray((err, result) => {
          const original_urls = result.map((val, index) => [val.original_url, index]);
          const matchedDoc = original_urls.filter(val => val[0] == url);
          let index;
          if (matchedDoc.length) index = matchedDoc[0][1];
          const matched = matchedDoc.length;
            
          if (matched) {
            // Show data of existing document in a page
            const obj = {
              original_url: result[index].original_url,
              short_url : result[index].short_url
            };
            res.json(obj);
          }
          else {
            // Add new document into database and show its data in a page
            const short_urls = result.map(val => val.short_url);
            let countFails = 0;
            let rangeRandom = 10000;
            let newShortUrl;
            const addNewShortUrl = () => {
              const num = Math.floor(Math.random() * rangeRandom);
              const shortUrl = `https://raspy-fright.glitch.me/${num}`;
              const matched = short_urls.filter(val => val == shortUrl).length;
              if (matched && countFails < 10) {
                countFails++;
                addNewShortUrl();
              } 
              else if (matched && countFails == 10) {
                countFails = 0;
                rangeRandom *= 10;
                addNewShortUrl();
              }
              else {
                newShortUrl = shortUrl;
              }
            };
            addNewShortUrl();
            const obj = {
              original_url: url,
              short_url: newShortUrl
            };
              
            res.json(obj);
            collection.insert(obj);
              
          }
            
        });
      }
      else {
        const obj = {
          error: "Wrong url format, make sure you have a valid protocol and real site."
        };
        res.json(obj);
      }
  });
});

app.listen(port, () => {
  console.log('Your app is listening on port ' + port);
});
