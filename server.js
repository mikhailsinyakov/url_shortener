const express = require('express');
const app = express();
const port = process.env.PORT;
//const mongo = require("mongodb").MongoClient;
const mongoConnect = require("./mongoConnect");
const addEntry = require("./addEntry");


app.use(express.static('public'));

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});


app.get(/\/new\/[\S]+/, (req, res) => {
      const query = req.url.slice(5);
      let obj = {};
  
      // If the query is a valid url
      if (query.match(/https?:\/\/(www.)?[\w]+.[\w]{2,5}(\/[\w\?=&-]+)*/)) {
        const url = query;
        mongoConnect((err, db) => {
          if (err) console.error("Can't access to database");
          const collection = db.db("short_urls").collection("short_urls");
          // Check if this url already exist
          collection.find({original_url: url}).toArray((err, result) => {
            if (!result[0]) {
              addEntry(collection, url, () => res.json(obj));
            }
            else {
              
            }
          });
        });
      }
      else {
        obj = {
          error: "Wrong url format, make sure you have a valid protocol and real site."
        };
        res.json(obj);
      }
      
      
    });


app.listen(port, () => {
  console.log('Your app is listening on port ' + port);
});
