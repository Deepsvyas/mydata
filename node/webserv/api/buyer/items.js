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
    var whereCond = {shop_id: new ObjectId(req.body.shopid), sellerdelete: 0};

    itemConn.aggregate([
        {
            $lookup:
                    {
                        from: "units",
                        localField: "unit",
                        foreignField: "_id",
                        as: "units_data"
                    }

        },
        {
            $unwind: "$units_data"
        },
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
        }
        ,
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
        }
        ,
        {"$match": whereCond},
        { $sort : { _id : -1} },
    ], function (err, result) {
        //itemConn.find(whereCond).toArray(function (err, result) {
        if (err)
            throw err;
        json['success'] = 1;
        json['success_mess'] = "loaded ...";
        json['result'] = result;
        res.send(json);
    });
};

exports.item_details = function (req, res) {
    var whereCond = {shop_id: new ObjectId(req.body.itemid)};
    itemConn.aggregate([
        {
            $lookup:
                    {
                        from: "units",
                        localField: "unit",
                        foreignField: "_id",
                        as: "units_data"
                    }

        },
        {
            $unwind: "$units_data"
        },
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
        }
        ,
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
        }
        ,
        {"$match": whereCond},
    ], function (err, result) {
        //itemConn.findOne({_id: new ObjectId(req.body.itemid)}, function (err, result) {
        if (err)
            throw err;
        var json = {};
        json['success'] = 1;
        json['success_mess'] = "loaded...";
        json['result'] = result;
        res.send(json);
    });
};



exports.search_item_list = function (req, res) {
    var json = {};
    var minv = parseFloat(req.body.minv)-1;
    var maxv = parseFloat(req.body.maxv) + 1;
    var searchby = req.body.searchby;
    if (searchby.length > 0)
    {
        var whereCond = {shop_id: new ObjectId(req.body.shopid), sellerdelete: 0, price: {$gt: minv, $lt: maxv}, $or: [{item_name: {$regex: ".*" + req.body.searchby + ".*", $options : 'i'}}, {description: {$regex: ".*" + req.body.searchby + ".*", $options : 'i'}}]};
    }else{
        var whereCond = {shop_id: new ObjectId(req.body.shopid), sellerdelete: 0, price: {$gt: minv, $lt: maxv} };
    }

    itemConn.aggregate([
        {
            $lookup:
                    {
                        from: "units",
                        localField: "unit",
                        foreignField: "_id",
                        as: "units_data"
                    }
        },
        {
            $unwind: "$units_data"
        },
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
        }
        ,
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
        }
        ,
        {"$match": whereCond},
        { $sort : { price : 1} },
    ], function (err, result) {
        //itemConn.find(whereCond).toArray(function (err, result) {
        if (err)
            throw err;
        json['success'] = 1;
        json['success_mess'] = "loaded ...";
        json['result'] = result;
        res.send(json);
    });
};











