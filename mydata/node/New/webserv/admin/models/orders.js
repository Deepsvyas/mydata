var mongodbCon = require('../../db.js');
var ObjectId = require('mongodb').ObjectId;
var tbl_name = "orders";

var Order = {};

mongodbCon(function (err, db) {
    if (err)
        throw err;
    Order = db.collection(tbl_name);
});


exports.list = function (req, res, next) {
    Order.find({}).toArray(function (err, result) {
        if (err)
            throw err;
        res.render('order/list', {page_title: "Orders | Admin", data: result, order:true});
    });
};

exports.ajaxlist = function (req, res, next) {
    Order.find({}).toArray(function (err, result) {
        if (err)
            throw err;
        var json = {};
        var html = res.render('order/ajaxlist', {data: result}, function (err, html) {
            json['success'] = 1;
            json['success_mess'] = "your logging successfully";
            json['html'] = html;
            res.send(json);
        });
    });
};

exports.addnew = function (req, res, next) {
    req.check('ordername', 'order name required').notEmpty();
    var errors = req.validationErrors();
    var json = {};
    if (errors) {
        json['error'] = 1;
        json['error_mess'] = errors;
    } else {
        var insertData = {
            ordername: req.body.ordername,
        };
        if (req.body.order_id.length == 0) {
            Order.insertOne(insertData, function (err, res) {
                if (err)
                    throw err;
            });
            json['success_mess'] = "Insert Records successfully!";
        } else {
            Order.updateOne({_id: new ObjectId(req.body.order_id)}, {"$set": insertData}, function (err, res) {
                if (err)
                    throw err;
            });
            json['success_mess'] = "Updated Records successfully !";
        }
        json['success'] = 1;
    }
    res.send(json);
};


exports.getContent = function (req, res, next) {
    var whereCond = {_id: new ObjectId(req.body.order_id)};
    Order.findOne(whereCond, function (err, result) {
        if (err)
            throw err;
        var json = {};
        if (result) {
            json['success'] = 1;
            json['success_mess'] = "your logging successfully";
            json['result'] = result;
        } else {
            json['error'] = 1;
            json['error_mess'] = "Some thing error Please try again";
        }
        res.send(json);
    });
};



exports.deleteorder = function (req, res, next) {
    var whereCon = {_id: new ObjectId(req.body.order_id)};
    Order.deleteOne(whereCon, function (err, result) {
        if (err)
            throw err;
        var json = {};
        if (result) {
            json['success'] = 1;
            json['success_mess'] = "Delete Records successfully !";
        } else {
            json['error'] = 1;
            json['error_mess'] = "Some thing error Please try again";
        }
        res.send(json);
    });
};
