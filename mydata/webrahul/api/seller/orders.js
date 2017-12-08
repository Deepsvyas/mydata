/*
 * GET users listing.
 */
var mongodbCon = require( '../../db.js' );

var ObjectId = require('mongodb').ObjectId;
var tbl_name = 'orders';
var tbl_name1 = 'users';

var orderConn = {};
var usersConn = {};

mongodbCon(function (err, db) {
    if (err)
        throw err;
    orderConn = db.collection(tbl_name);
    usersConn = db.collection(tbl_name1);
});


var FCM = require('fcm-push');
var serverkey = 'AAAAP3sk4eQ:APA91bEPLtwLw1xsjlLMcC15AJvqgHf-H-QtkfvwY24_iPw1cD5XfJfHD1eUYtkOuSDR6LTqQE4m53ziyioy37-Y9DGu1tVS18FtScpQIu_4VDfM6tbb2qtRUntETcDmT12pCyZeLn8_';
var fcm = new FCM(serverkey);

exports.list = function (req, res) {

    orderConn.find({shop_id: new ObjectId(req.body.shopid)}, null, {sort: {_id: -1}}).toArray(function (err, result) {
        if (err)
            throw err;
        var json = {};
        json['success'] = 1;
        json['success_mess'] = "load ...";
        json['result'] = result;
        res.send(json);
    });

};

exports.orderedit = function (req, res) {

    var updateData = {
        dishonour: req.body.dishonour,
        dispatch: req.body.dispatch,
        pickup: req.body.pickup,
        cancel_by: req.body.cancelby
    };
    orderConn.updateOne({_id: new ObjectId(req.body.orderid)}, {"$set": updateData}, function (err, res) {
        if (err)
            throw err;
        
        usersConn.findOne({_id: new ObjectId(req.body.userid)}, function (err, usresult) {

            var message = {//this may vary according to the message type (single recipient, multicast, topic, et cetera)
                to: usresult.device_id,
                //collapse_key: 'your_collapse_key',
                notification: {
                    title: req.body.shopname,
                    body: 'Your order Status is changed by seller'
                },
                data: {//you can send only notification or only data(or include both)
                    my_key: req.body.shopname,
                    my_another_key: 'Your order Status is changed by seller'
                }
            };

            fcm.send(message, function (err, response) {
                if (err) {
                    throw err;
                }
            });
        });

    });
    var json = {};
    json['success'] = 1;
    json['success_mess'] = "Updated Records successfully !";
    res.send(json);


};

exports.ordertimeedit = function (req, res) {

    var updateData = {
        delivery_date: req.body.delivery_date,
        delivery_time: req.body.delivery_time,
    };
    orderConn.updateOne({_id: new ObjectId(req.body.orderid)}, {"$set": updateData}, function (err, res) {
        if (err)
            throw err;
        
        // New order place on app notification        
        usersConn.findOne({_id: new ObjectId(req.body.userid)}, function (err, usresult) {

            var message = {//this may vary according to the message type (single recipient, multicast, topic, et cetera)
                to: usresult.device_id,
                //collapse_key: 'your_collapse_key',
                notification: {
                    title: req.body.shopname,
                    body: 'Your order accepted'
                },
                data: {//you can send only notification or only data(or include both)
                    my_key: req.body.shopname,
                    my_another_key: 'Your order accepted'
                }
            };

            fcm.send(message, function (err, response) {
                if (err) {
                    throw err;
                } 

            });
        });
    });
    var json = {};
    json['success'] = 1;
    json['success_mess'] = "Updated Records successfully !";
    res.send(json);
};


exports.pendding_list = function (req, res) {

    var json = {};
    var records = {};

//         $and : [
//                { shop_id: new ObjectId(req.body.shopid) },
//            ],
//            $and : [
//                { $or : [ { dishonour: 0}, { dispatch: 0 } ] },
//            ]

    orderConn.find({shop_id: new ObjectId(req.body.shopid), dishonour: 0, dispatch: 0}, null, {sort: {_id: -1}}).toArray(function (err, result) {
        if (err)
            throw err;
        json['success'] = 1;
        json['success_mess'] = "load ...";
        json['result'] = result;
        res.send(json);
    });

};

exports.details = function (req, res) {

    orderConn.findOne({_id: new ObjectId(req.body.orderid)}, function (err, oresult) {
        if (err)
            throw err;
        db.collection('orderdetails').findOne({_id: new ObjectId(req.body.orderid)}, function (err, dresult) {
            if (err)
                throw err;
            var json = {};
            json['success'] = 1;
            json['success_mess'] = "loaded...";
            json['orderresult'] = result;
            json['detailsresult'] = dresult;
            res.send(json);
        });
    });

};

