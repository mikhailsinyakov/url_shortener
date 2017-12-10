const mongo = require("mongodb").MongoClient;
const url = "mongodb://mikhailsinyakov:ool8Lq1FBibAOax36449@ds135156.mlab.com:35156/short_urls";

module.exports = (callback) => mongo.connect(url, callback);