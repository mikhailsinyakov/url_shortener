module.exports = (collection, url) => {
  let shortUrl;
  setTimeout(function() {console.log(createShortUrl())}, 500);
  //console.log(shortUrl)
  //coll.insert({original_url: url, short_url: })
  function createShortUrl() {
    const num = Math.floor(Math.random() * 100000);
    const shortUrl = `https://raspy-fright.glitch.me/${num}`;
    collection.find({short_url: shortUrl}).toArray((err,result) => {
    if (result[0]) {
      createShortUrl();
    }
    else return shortUrl;
  });
}
  
  return {
    original_url: "",
    short_url: ""
  };
};