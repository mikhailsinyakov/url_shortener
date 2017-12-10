const express = require('express');
const app = express();
const port = process.env.PORT;
app.use(express.static('public'));

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});


app.get(/\/new\/[\S]+/, (req, res) => {
      const url = req.url.slice(5);
      console.log(url);
      console.log(url.match(/https?:\/\/(www.)?[\w]+.[\w]{2,5}(\/[\w\?=&-]+)*/));
      const obj = {
        original_url: url,
        short_url: ""
      };
      res.set("Content-Type", "application/json");
      res.json(obj);
    });


app.listen(port, () => {
  console.log('Your app is listening on port ' + port);
});
