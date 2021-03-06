var mongodbCon = require( '../../db.js' );

var ObjectId = require('mongodb').ObjectId;
var tbl_name = 'favorites';
// mongo connection in node js.

var cartConn = {};
mongodbCon(function (err, db) {
    if (err)
        throw err;
    favoConn = db.collection(tbl_name);
});



exports.add_favorites = function (req, res) {
    req.check('shopid', 'shopid is required').notEmpty();
    req.check('userid', 'userid is required').notEmpty();
    req.check('itemid', 'item id is required').notEmpty();
    req.check('gstslabs', 'gst slabs is required').notEmpty();
    //req.check('description', 'Description is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    } else {

        var whereCond = {
            shop_id: new ObjectId(req.body.shopid),
            user_id: new ObjectId(req.body.userid),
            item_id: new ObjectId(req.body.itemid),
        };
        
        favoConn.findOne(whereCond, function (err, fresult) {
            
            if (fresult) {
                var json = {};
                json['error'] = 1;
                json['error_msg'] = "sorry item already added in cart!";
                res.send(json);
            } else {
                var insertData = {
                    shop_id: new ObjectId(req.body.shopid),
                    user_id: new ObjectId(req.body.userid),
                    item_id: new ObjectId(req.body.itemid),
                    quantity: req.body.quantity,
                    item_name: req.body.item_name,
                    category_id: new ObjectId(req.body.categoryid),
                    price: req.body.price,
                    description: req.body.description,
                    gst_slabs: new ObjectId(req.body.gstslabs),
                    img1: req.body.img1,
                    img2: req.body.img2,
                    img3: req.body.img3,
                    img4: req.body.img4,
                    img5: req.body.img5,
                };
                favoConn.insertOne(insertData, function (err, res) {
                    if (err)
                        throw err;
                });
                var json = {};
                json['success'] = 1;
                json['success_mess'] = "Insert Records successfully !";
                res.send(json);
            }
        });
    }
};


exports.my_favorites = function (req, res) {
    req.check('userid', 'userid is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    } else {
        var json = {};
        var whereCond = {user_id: new ObjectId(req.body.userid)};
        favoConn.aggregate([
        {
            $lookup:
                    {
                        from: "shops",
                        localField: "shop_id",
                        foreignField: "_id",
                        as: "shop_data"
                    }
        },
        {
            $unwind: "$shop_data"
        }
        ,
        {
            $lookup:
                    {
                        from: "gst_slabs",
                        localField: "gst_slabs",
                        foreignField: "_id",
                        as: "gst_data"
                    }
        },
        {
            $unwind: "$gst_data"
        },
        {
            $lookup:
                    {
                        from: "categories",
                        localField: "category_id",
                        foreignField: "_id",
                        as: "category_data"
                    }
        },
        {
            $unwind: "$category_data"
        },
        {"$match": whereCond},
    ], function (err, result) {
        //favoConn.find(whereCond).toArray(function (err, result) {
            if (err)
                throw err;
            json['success'] = 1;
            json['success_mess'] = "loaded ...";
            json['result'] = result;
            res.send(json);
        });
    }
};

exports.delete_favorites_item = function (req, res) {
    req.check('favid', 'favid is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    } else {
        var json = {};
        var whereCond = {_id: new ObjectId(req.body.favid)};
        favoConn.remove(whereCond, function (err, result) {
            if (err)
                throw err;
            json['success'] = 1;
            json['success_mess'] = "delete successfully";
            json['result'] = result;
            res.send(json);
        });
    }
};
