const express = require('express');
const app = express();
const port = process.env.PORT;
app.use(express.static('public'));

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});


app.get(/\/new\/https?:\/\/(www.)?[\w]+.[\w]{2,5}(\/[\w\?=&-]+)*/, (req, res) => {
      const url = req.url;
      console.log(url);
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
