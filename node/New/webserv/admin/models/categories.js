var mongodbCon = require('../../db.js');
var ObjectId = require('mongodb').ObjectId;
var tbl_name = "categories";
var fs = require('fs');

var Category = {};

mongodbCon(function (err, db) {
    if (err)
        throw err;
    Category = db.collection(tbl_name);
});


exports.list = function (req, res, next) {
        res.render('category/list', {page_title: "Categories | Admin", category: true});
};

exports.ajaxlist = function (req, res, next) {
    var count = 0;
    var sortcol = req.body.columns[req.body.order[0]['column']]['data'];
    var sortval  = -1;
    var searchval = req.body.search['value'];
    if(req.body.order[0]['dir'] == "desc"){
        sortval = 1;
    }
    var sortjson = {};
    sortjson[sortcol] = sortval;
    Category.find({categoryname: {$regex: ".*" + searchval.trim() + ".*", $options : 'i'}}).toArray(function (err, counts) {
        count =  counts.length;
        Category.find({categoryname: {$regex: ".*" + searchval.trim() + ".*", $options : 'i'}}).sort(sortjson).skip(parseFloat(req.body.start)).limit(parseFloat(req.body.length)).toArray(function (err, result) {
            if (err)
                throw err;
            var json = {};
            var data = [];
            for (var i in result) {
                var sr_num = i;
                var childarray = {};
                var cate_nam = "" + result[i].categoryname + "";
                childarray._id = ++sr_num;
                childarray.categoryname = cate_nam;
                childarray.action = '<a class="btn btn-success btn-sm a-inside editCat" data-id="' + result[i]._id + '">Edit</a>\
                                            <a class="btn btn-danger btn-sm a-inside deleteCat" data-id="' + result[i]._id + '">Delete</a>';
                data.push(childarray);
            }
            json['success'] = 1;
            json['success_mess'] = "your logging successfully";
            json['data'] = data;
            json['recordsTotal'] = count;
            json['recordsFiltered'] = count;
            res.send(json);
        });
    });
};

exports.addnew = function (req, res, next) {
    req.check('categoryname', 'category name required').notEmpty();
    var errors = req.validationErrors();
    var json = {};
    if (errors) {
        json['error'] = 1;
        json['error_mess'] = errors;
    } else {
        var insertData = {
            categoryname: req.body.categoryname,
        };
        if (req.body.category_id.length == 0) {
            Category.insertOne(insertData, function (err, res) {
                if (err)
                    throw err;
            });
            json['success_mess'] = "Insert Records successfully!";
        } else {
            Category.updateOne({_id: new ObjectId(req.body.category_id)}, {"$set": insertData}, function (err, res) {
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
    var whereCond = {_id: new ObjectId(req.body.category_id)};
    Category.findOne(whereCond, function (err, result) {
        if (err)
            throw err;
        var json = {};
        if (result) {
            json['success'] = 1;
            json['success_mess'] = "Loaded..";
            json['result'] = result;
        } else {
            json['error'] = 1;
            json['error_mess'] = "Some thing error Please try again";
        }
        res.send(json);
    });
};



exports.deleteCat = function (req, res, next) {
    var whereCon = {_id: new ObjectId(req.body.category_id)};
    Category.deleteOne(whereCon, function (err, result) {
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
