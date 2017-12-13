module.exports = function(callback) {
    var MongoClient = require( 'mongodb' ).MongoClient;
    var url = 'mongodb://db_app_user:$BcJTB9SP^@35.187.242.88:27017/ecommerce_app';
    MongoClient.connect(url, callback);
}


