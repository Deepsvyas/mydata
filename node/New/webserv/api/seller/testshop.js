
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://db_app_user:$BcJTB9SP^@35.198.204.248:27017/ecommerce_app";
var ObjectId = require('mongodb').ObjectId;
var tbl_name = "shops";
var tbl_name1 = "testshops";
var Schema = MongoClient.Schema;




exports.testshopgeo = function (req, res) {
    
    var shopsModel =  new Testshops(); 
    shopsModel.name = req.body.name;
    shopsModel.geo = [req.body.lat, req.body.lng];

    shopsModel.save(function (err) {
        if (err)
            res.send(err);

        res.json({});
    });
};