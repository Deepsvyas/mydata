
/*
 * GET users listing.
 */

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://db_app_user:$BcJTB9SP^@35.198.204.248:27017/ecommerce_app";

var Schema     = MongoClient.Schema;

var TestshopSchema   = new Schema({
  name: String,
  geo: {
    type: [Number],
    index: '2d'
  }
});

module.exports = MongoClient.model('Shops', TestshopSchema);