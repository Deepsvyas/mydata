var mongodbCon = require('../../db.js');
var ObjectId = require('mongodb').ObjectId;
var tbl_name = "units";

var Unit = {};
mongodbCon(function (err, db) {
    if (err)
        throw err;
    Unit = db.collection(tbl_name);
});


exports.list = function (req, res, next) {
        res.render('unit/list', {page_title: "Units"});
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
    Unit.find({unitname: {$regex: ".*" + searchval.trim() + ".*", $options : 'i'}}).toArray(function (err, counts) {
        count =  counts.length;
        Unit.find({unitname: {$regex: ".*" + searchval.trim() + ".*", $options : 'i'}}).sort(sortjson).skip(parseFloat(req.body.start)).limit(parseFloat(req.body.length)).toArray(function (err, result) {
            if (err)
                throw err;
            var json = {};
            var data = [];
            for (var i in result) {
                var sr_num = i;
                var childarray = {};
                childarray._id = ++sr_num;
                childarray.unitname = result[i].unitname;
                childarray.unitcode = (typeof result[i].unitcode != "undefined") ? result[i].unitcode : "---";
                childarray.status = '<label class="label label-info">'+(result[i].status)?  "active" : "Unactive" +'</label>';
                childarray.action = '<a class="btn btn-success btn-sm a-inside editUnit" data-id="' + result[i]._id + '">Edit</a>\
                                            <a class="btn btn-danger btn-sm a-inside deleteUnit" data-id="' + result[i]._id + '">Delete</a>';
                data.push(childarray);
            }
            json['success'] = 1;
            json['success_mess'] = "Loaded...";
            json['data'] = data;
            json['recordsTotal'] = count;
            json['recordsFiltered'] = count;
            json['draw'] = 0;
            res.send(json);
        });
    });
};

exports.addnew = function (req, res, next) {
    req.check('unitname', 'unit name required').notEmpty();
    req.check('unitcode', 'unit code required').notEmpty();
    var errors = req.validationErrors();
    var json = {};
    if (errors) {
        json['error'] = 1;
        json['error_mess'] = errors;
    } else {
        var insertData = {
            unitname: req.body.unitname,
            unitcode: req.body.unitcode,
            status: 1,
        };
        if (req.body.unit_id.length == 0) {
            Unit.insertOne(insertData, function (err, res) {
                if (err)
                    throw err;
            });
            json['success_mess'] = "Insert Records successfully!";
        } else {
            Unit.updateOne({_id: new ObjectId(req.body.unit_id)}, {"$set": insertData}, function (err, res) {
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
    var whereCond = {_id: new ObjectId(req.body.unit_id)};
    Unit.findOne(whereCond, function (err, result) {
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



exports.deleteUnit = function (req, res, next) {
    var whereCon = {_id: new ObjectId(req.body.unit_id)};
    Unit.deleteOne(whereCon, function (err, result) {
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
