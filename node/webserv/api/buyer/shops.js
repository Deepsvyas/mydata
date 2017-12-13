var mongodbCon = require( '../../db.js' );
var ObjectId = require('mongodb').ObjectId;
var tbl_name = "shops";
var shopConn = {};
mongodbCon(function (err, db) {
    if (err)
        throw err;
    shopConn = db.collection(tbl_name);
});



exports.find_shop = function (req, res) {
    
    var whereCond = {
     location:
       { $near:
          {
            $geometry: { type: "Point",  coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat) ] },
            //$minDistance: 10000,
            //$maxDistance: 50000
          }
       },
       category_id: new ObjectId(req.body.categoryid), 
       shop_available: "Yes",
       
   }
    //var whereCond = {category_id: new ObjectId(req.body.categoryid), shop_available: "Yes"};
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
exports.find_shop_by_name = function (req, res) {
    var shopname = req.body.shopname;
    if (shopname.length > 0)
    {
        var whereCond = {category_id: new ObjectId(req.body.categoryid), shop_available: "Yes", shop_name: {$regex: ".*" + req.body.shopname + ".*", $options : 'i'}};
    } else {
        var whereCond = {category_id: new ObjectId(req.body.categoryid), shop_available: "Yes"};
    }
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
exports.find_shop_name = function (req, res) {

    var shopname = req.body.shopname;
    var whereCond = {shop_available: "Yes", shop_name: {$regex: ".*" + req.body.shopname + ".*", $options : 'i'}};
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
//exports.find_shop = function (req, res) {
//
//    
//   
//
//
//    //var whereCond = {lat: req.body.lat, lng: req.body.lng, /* category: req.body.category */};
//    //whereCond = {category_id: req.body.categoryid};
//    shopConn.find({location:
//                {$near:
//                            {
//                                $geometry: {type: "Point", coordinates: [-73.9667, 40.78]},
//                                $minDistance: 1000,
//                                $maxDistance: 5000
//                            }
//                }
//    }).toArray(function (err, result) {
//        if (err)
//            throw err;
//        var json = {};
//        json['success'] = 1;
//        json['success_mess'] = "loaded...";
//        json['result'] = result;
//        res.send(json);
//    });
//};

