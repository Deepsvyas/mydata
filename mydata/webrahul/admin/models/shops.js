var mongodbCon = require('../../db.js');

var tbl_name = "shops";
var shopConn = {};
mongodbCon(function (err, db) {
    if (err)
        throw err;
    shopConn = db.collection(tbl_name);
});

exports.find_shop = function (req, res) {
    var whereCond = {lat: req.body.lat, lng: req.body.lng, /* category: req.body.category */};
    shopConn.find(whereCond).toArray(function (err, result) {
        if (err)
            throw err;
        var json = {};
        json['success'] = 1;
        json['success_mess'] = "loaded...";
        json['result'] = result;
        res.send(json);
    });
};
