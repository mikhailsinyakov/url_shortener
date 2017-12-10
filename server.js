const express = require('express');
const app = express();
const port = process.env.PORT;
app.use(express.static('public'));



app.route("/new/:url")
    .all((req, res) => {
      const url = req.params.url;
      console.log(req.params.url);
      res.send("H");
    });

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.listen(port, () => {
  console.log('Your app is listening on port ' + port);
});
