module.exports = (collection, url, callback) => {
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