var mongodbCon = require('../../db.js');

var ObjectId = require('mongodb').ObjectId;
var tbl_name = 'orders';
// mongo connection in node js.

var orderConn = {};
mongodbCon(function (err, db) {
    if (err)
        throw err;
    orderConn = db.collection(tbl_name);
});


exports.my_orders = function (req, res) {
    var json = {};
    var whereCond = {user_id: new ObjectId(req.body.userid)};
    orderConn.find(whereCond).toArray(function (err, result) {
        if (err)
            throw err;
        json['success'] = 1;
        json['success_mess'] = "loaded ...";
        json['result'] = result;
        res.send(json);
    });
};

exports.order_details = function (req, res) {
    orderConn.findOne({_id: new ObjectId(req.body.orderid)}, function (err, result) {
        if (err)
            throw err;
        var json = {};
        json['success'] = 1;
        json['success_mess'] = "loaded...";
        json['result'] = result;
        res.send(json);
    });
};

exports.add_order = function (req, res) {
    req.check('category', 'Category is required').notEmpty();
    req.check('price', 'Price is required').notEmpty();
    req.check('until', 'Until is required').notEmpty();
    req.check('available_qty', 'Available Qty is required').notEmpty();
    req.check('description', 'Description is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    } else {
        var insertData = {
            category: req.body.category,
            price: req.body.price,
            shop_id: new ObjectId(req.params.shopid),
            until: req.body.until,
            available_qty: req.body.available_qty,
            description: req.body.description,
        };
        orderConn.insertOne(insertData, function (err, res) {
            if (err)
                throw err;
        });
        var json = {};
        json['success'] = 1;
        json['success_mess'] = "Insert Records successfully !";
        res.send(json);
    }
};
exports.update_order = function (req, res) {
    req.check('category', 'Category is required').notEmpty();
    req.check('price', 'Price is required').notEmpty();
    req.check('until', 'Until is required').notEmpty();
    req.check('available_qty', 'Available Qty is required').notEmpty();
    req.check('description', 'Description is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    } else {
        var updateData = {
            category: req.body.category,
            price: req.body.price,
            until: req.body.until,
            available_qty: req.body.available_qty,
            description: req.body.description,
        };
        orderConn.updateOne({_id: new ObjectId(req.params.orderid)}, {"$set": updateData}, function (err, res) {
            if (err)
                throw err;
        });
        var json = {};
        json['success'] = 1;
        json['success_mess'] = "Updated Records successfully !";
        res.send(json);
    }
};

