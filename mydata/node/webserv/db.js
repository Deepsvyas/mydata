module.exports = function(callback) {
    var MongoClient = require( 'mongodb' ).MongoClient;
    var url = 'mongodb://127.0.0.1:27017/mydb';
    MongoClient.connect(url, callback);
}


