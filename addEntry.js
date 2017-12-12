module.exports = (collection, url, callback) => {
  
  collection.find().toArray((err,result) => {
    const short_urls = result.map(val => val.short_url);
  });
  
  function createShortUrl() {
    const num = Math.floor(Math.random() * 100000);
    const shortUrl = `https://raspy-fright.glitch.me/${num}`;
    collection.find({short_url: shortUrl}).toArray((err,result) => {
      if (result[0]) {
        createShortUrl();
      }
      else {
        const obj = {
          original_url: url,
          short_url: shortUrl
        };
        console.log(obj)
        callback(obj);
      } 
    });
  }
  
};