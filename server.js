const express = require('express');
const app = express();
const port = process.env.PORT;
app.use(express.static('public'));

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});


app.route("/new/:url")
  .get((req, res) => {
      const url = req.params.url;
      console.log(req.params.url);
      const obj = {
        //original_url: url,
        short_url: ""
      };
      res.set("Content-Type", "application/json");
      res.json(obj);
    });


app.listen(port, () => {
  console.log('Your app is listening on port ' + port);
});
