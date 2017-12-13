const express = require('express');
const app = express();
const port = process.env.PORT;
const mongoConnect = require("./mongoConnect");

app.use(express.static('public'));

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

mongoConnect((err, db) => {
  if (err) console.error("Can't access to database");
  const collection = db.db("freecodecamp_projects").collection("short_urls");
  app.get(/^\/\S+$/, (req, res) => {
    const path = req.url;
    let obj;
    
    if (path.match(/^\/new\/\S+$/)) {
      const query = req.url.slice(5);
      const validUrl = /^https?:\/\/(www.)?[\w]+.[\w]{2,5}(\/[\w\?=&-]+)*$/;
      
      if (!query.match(validUrl)) {
        obj = {
          error: "Wrong url format, make sure you have a valid protocol and real site."
        };
        res.json(obj);
        return;
      }
      
      const url = query;
      collection.find().toArray((err, result) => {
        const original_urls = result.map((val, index) => [val.original_url, index]);
        const matchedDoc = original_urls.filter(val => val[0] == url);
        let index;
        if (matchedDoc.length) index = matchedDoc[0][1];
        const matched = matchedDoc.length;

        if (matched) {
          // Show data of existing document in a page
          obj = {
            original_url: result[index].original_url,
            short_url : result[index].short_url
          };
          res.json(obj);
          return;
        }
        
        // Add new document into database and show its data in a page
        const short_urls = result.map(val => val.short_url);
        let countFails = 0;
        let rangeRandom = 10000;
        let newShortUrl;
        (function addNewShortUrl() {
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
        })();
          
        obj = {
          original_url: url,
          short_url: newShortUrl
        };
        res.json(obj);
        collection.insert(obj);
            
      });
    }
    else if (path.match(/^\/\d+$/)) {
      const query = req.url.slice(1);
      const shortUrl = `https://raspy-fright.glitch.me/${query}`;
      collection.find().toArray((err, result) => {
        const short_urls = result.map((val, index) => [val.short_url, index]);
        const matchedDoc = short_urls.filter(val => val[0] == shortUrl);
        let index;
        if (matchedDoc.length) index = matchedDoc[0][1];
        const matched = matchedDoc.length;
        if (!matched) {
          obj = {
            error: "First use https://raspy-fright.glitch.me/new/yourwebsite"
          }
          res.json(obj);
          return;
        }
        const originalUrl = result[index].original_url;
        res.redirect(originalUrl);
      });
    }
    else {
      obj = {
        error: "Invalid request, please get information on https://raspy-fright.glitch.me/"
      };
      res.json(obj);
    }
  });
});

app.listen(port);
