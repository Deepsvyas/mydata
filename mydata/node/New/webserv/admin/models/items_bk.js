var mongodbCon = require('../../db.js');
var ObjectId = require('mongodb').ObjectId;
var tbl_name = "items";

var Item = {};

mongodbCon(function (err, db) {
    if (err)
        throw err;
    Item = db.collection(tbl_name);
    Category = db.collection('categories');
});


exports.list = function (req, res, next) {
    getCateories(Category, function (categories) {
        res.render('item/list', {page_title: "Items | Admin", categories : categories});
    });
};

exports.ajaxlist = function (req, res, next) {
    var count = 0;
    var sortcol = req.body.columns[req.body.order[0]['column']]['data'];
    var sortval = -1;
    var searchval = req.body.search['value'];
    if (req.body.order[0]['dir'] == "desc") {
        sortval = 1;
    }
    var sortjson = {};
    sortjson[sortcol] = sortval;
    Item.find({item_name: {$regex: ".*" + searchval.trim() + ".*", $options: 'i'}}).toArray(function (err, counts) {
        count = counts.length;
        Item.find({item_name: {$regex: ".*" + searchval.trim() + ".*", $options: 'i'}}).sort(sortjson).skip(parseFloat(req.body.start)).limit(parseFloat(req.body.length)).toArray(function (err, result) {
            if (err)
                throw err;
            var json = {};
            var data = [];
            getCateories(Category, function (categories) {

                for (var i in result) {
                    var sr_num = i;
                    var childarray = {};
                    childarray._id = ++sr_num;
                    childarray.item_name = result[i].item_name;
                    childarray.shop_id = result[i].shop_id;
                    childarray.category_id = (typeof categories[result[i].category_id] != "undefined") ? categories[result[i].category_id] : "---";
                    childarray.price = result[i].price;
                    childarray.available_qty = result[i].available_qty;
                    childarray.description = result[i].description;
                    childarray.action = '<a class="btn btn-success btn-sm a-inside editItem" data-id="' + result[i]._id + '">Edit</a>\
                                            <a class="btn btn-danger btn-sm a-inside deleteItem" data-id="' + result[i]._id + '">Delete</a>';
                    data.push(childarray);
                }
                json['success'] = 1;
                json['success_mess'] = "Loaded...";
                json['data'] = data;
                json['recordsTotal'] = count;
                json['recordsFiltered'] = count;
                res.send(json);
            });
        });
    });
};

exports.addnew = function (req, res, next) {
    req.check('itemname', 'item name required').notEmpty();
    var errors = req.validationErrors();
    var json = {};
    if (errors) {
        json['error'] = 1;
        json['error_mess'] = errors;
    } else {
        var insertData = {
            itemname: req.body.itemname,
        };
        if (req.body.item_id.length == 0) {
            Item.insertOne(insertData, function (err, res) {
                if (err)
                    throw err;
            });
            json['success_mess'] = "Insert Records successfully!";
        } else {
            Item.updateOne({_id: new ObjectId(req.body.item_id)}, {"$set": insertData}, function (err, res) {
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
    var whereCond = {_id: new ObjectId(req.body.item_id)};
    Item.findOne(whereCond, function (err, result) {
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



exports.deleteitem = function (req, res, next) {
    var whereCon = {_id: new ObjectId(req.body.item_id)};
    Item.deleteOne(whereCon, function (err, result) {
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

function getCateories(Category, callback) {
    Category.find({}).toArray(function (err, result) {
        if (err) {
        } else if (result.length > 0) {
            var categories = {};
            for (var i in result) {
                categories[result[i]._id] = result[i].categoryname;
            }
            callback(categories);
        }
    });
}
