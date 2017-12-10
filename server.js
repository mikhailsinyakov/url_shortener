const express = require('express');
const app = express();
const port = process.env.PORT;
app.use(express.static('public'));

app.get("/", (request, response) => {
  response.sendFile(__dirname + '/views/index.html');
});

app.post("/dreams", (req, res) => {
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log('Your app is listening on port ' + port);
});
