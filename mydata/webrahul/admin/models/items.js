var mongodbCon = require('../../db.js');

var ObjectId = require('mongodb').ObjectId;
var tbl_name = 'items';
// mongo connection in node js.

var itemConn = {};
mongodbCon(function (err, db) {
    if (err)
        throw err;
    itemConn = db.collection(tbl_name);
});

exports.find_item_list = function (req, res) {
    var json = {};
    var whereCond = {shop_id: new ObjectId(req.body.shopid)};
    itemConn.find(whereCond).toArray(function (err, result) {
        if (err)
            throw err;
        json['success'] = 1;
        json['success_mess'] = "loaded ...";
        json['result'] = result;
        res.send(json);
    });
};

exports.item_details = function (req, res) {
    console.log(req.body.itemid);
    itemConn.findOne({_id: new ObjectId(req.body.itemid)}, function (err, result) {
        if (err)
            throw err;
        var json = {};
        json['success'] = 1;
        json['success_mess'] = "loaded...";
        json['result'] = result;
        res.send(json);
    });
};

