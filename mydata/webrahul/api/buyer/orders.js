var mongodbCon = require('../../db.js');

var ObjectId = require('mongodb').ObjectId;
var tbl_name = 'orders';
var tbl_name1 = 'carts';
var tbl_name2 = 'shops';
// mongo connection in node js.

var orderConn = {};
mongodbCon(function (err, db) {
    if (err)
        throw err;
    orderConn = db.collection(tbl_name);
    cartConn = db.collection(tbl_name1);
    shopConn = db.collection(tbl_name2);
});

var FCM = require('fcm-push');
var serverkey = 'AAAAP3sk4eQ:APA91bEPLtwLw1xsjlLMcC15AJvqgHf-H-QtkfvwY24_iPw1cD5XfJfHD1eUYtkOuSDR6LTqQE4m53ziyioy37-Y9DGu1tVS18FtScpQIu_4VDfM6tbb2qtRUntETcDmT12pCyZeLn8_';
var fcm = new FCM(serverkey);


exports.my_orders = function (req, res) {

    var json = {};    
    var whereCond = {
        user_id: new ObjectId(req.body.userid)
    };
    orderConn.aggregate([
        {
            $lookup:
                    {
                        from: "shops",
                        localField: "shop_id",
                        foreignField: "_id",
                        as: "shop_data"
                    }
        },
        {"$match": whereCond},
        { $sort : { _id : -1} },
    ] , function (err, result) {

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

    req.check('shopid', 'shop id is required').notEmpty();
    req.check('totalamount', 'total amount is required').notEmpty();
    req.check('shippingaddress', 'shipping address is required').notEmpty();
    req.check('phoneno', 'phoneno is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    } else {
        var itemdata = [];
        for (var i = 0; i < req.body.itemid.length; i++) {


            itemdata.push({
                item_id: ObjectId(req.body.itemid[i]),
                item_name: req.body.itemname[i],
                description: req.body.description[i],
                before_price: req.body.beforeprice[i],
                after_price: req.body.afterprice[i],
                quantity: req.body.quantity[i],
                gst_rate: req.body.gstrate[i],
                img: req.body.img[i]
            });
        }

        var rkey = randomString(6, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
        var insertData = {
            shop_id: new ObjectId(req.body.shopid),
            order_number: rkey,
            dishonour: 0,
            dispatch: 0,
            pickup: 0,
            user_id: ObjectId(req.body.userid),
            user_name: req.body.name,
            shipping_address: req.body.shippingaddress,
            phone_number: req.body.phoneno,
            total_amount: parseFloat(req.body.totalamount),
            payment_id: req.body.paymentid,
            delivery_mode: req.body.deliverymode,
            payment_status: req.body.paymentstatus,
            delivery_date: '',
            delivery_time: '',
            itemsdetails: itemdata,
            cancel_by: ''
        };
        orderConn.insertOne(insertData, function (err, res) {
            if (err)
                throw err;
            // New order place on app notification

            shopConn.findOne({_id: new ObjectId(req.body.shopid)}, function (err, shresult) {

                var message = {//this may vary according to the message type (single recipient, multicast, topic, et cetera)
                    to: shresult.device_id,
                    //collapse_key: 'your_collapse_key',
                    notification: {
                        title: 'kartZone',
                        body: 'New order place on your shop'
                    },
                    data: {//you can send only notification or only data(or include both)
                        my_key: 'kartZone',
                        my_another_key: 'New order place on your shop'
                    }
                };
                fcm.send(message, function (err, response) {
                    if (err) {
                        throw err;
                    }
                });
            });
        });
        for (var i = 0; i < req.body.cartid.length; i++) {

            var whereCond = {_id: new ObjectId(req.body.cartid[i])};
            cartConn.remove(whereCond, function (err, cresult) {
                if (err)
                    throw err;
            });
        }

        var json = {};
        json['success'] = 1;
        json['success_mess'] = "Insert Records successfully !";
        res.send(json);
    }
};
exports.cancel_order = function (req, res) {
    req.check('orderid', 'order id is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    } else {

        var updateData = {
            dishonour: req.body.dishonour,
            cancel_by: "By Buyer"
        };
        orderConn.updateOne({_id: new ObjectId(req.body.orderid)}, {"$set": updateData}, function (err, res) {
            if (err)
                throw err;
            
            // Cancel order should send notification to seller
            shopConn.findOne({_id: new ObjectId(req.body.shopid)}, function (err, shresult) {

                var message = {//this may vary according to the message type (single recipient, multicast, topic, et cetera)
                    to: shresult.device_id,
                    //collapse_key: 'your_collapse_key',
                    notification: {
                        title: 'kartZone',
                        body: 'Customer cancel the order'
                    },
                    data: {//you can send only notification or only data(or include both)
                        my_key: 'kartZone',
                        my_another_key: 'Customer cancel the order'
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
        json['success_mess'] = "Order cancel successfully !";
        res.send(json);
    }
};
function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
