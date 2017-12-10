const express = require('express');
const app = express();
const port = process.env.PORT;
//const mongo = require("mongodb").MongoClient;
const mongoConnect = require("./mongoConnect");


app.use(express.static('public'));

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});


app.get(/\/new\/[\S]+/, (req, res) => {
      const query = req.url.slice(5);
      let obj = {};
  
      // If a query is a valid url
      if (query.match(/https?:\/\/(www.)?[\w]+.[\w]{2,5}(\/[\w\?=&-]+)*/)) {
        const url = query;
        mongoConnect((err, db) => {
          if (err) console.error("Can't access to database");
          const coll = db.db("short_urls").collection("short_urls");
          // Check if this url already exist
          coll.find({original_url: url}, {_id: 0}).toArray((err, result) => {
            console.log(result);
          });
        });
        
        obj = {
          original_url: url,
          short_url: ""
        }
      }
      else {
        obj = {
          error: "Wrong url format, make sure you have a valid protocol and real site."
        };
      }
      
      res.set("Content-Type", "application/json");
      res.json(obj);
    });


app.listen(port, () => {
  console.log('Your app is listening on port ' + port);
});
