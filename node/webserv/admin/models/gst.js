var mongodbCon = require('../../db.js');
var ObjectId = require('mongodb').ObjectId;
var tbl_name = "gst_slabs";
var GST = {};
mongodbCon(function (err, db) {
    if (err)
        throw err;
    GST = db.collection(tbl_name);
});


exports.list = function (req, res, next) {
    res.render('gst/list', {page_title: "GST Slabs | Admin"});
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
    GST.find({gst_slabs: {$regex: ".*" + searchval.trim() + ".*", $options: 'i'}}).toArray(function (err, counts) {
        count = counts.length;
        GST.find({gst_slabs: {$regex: ".*" + searchval.trim() + ".*", $options: 'i'}}).sort(sortjson).skip(parseFloat(req.body.start)).limit(parseFloat(req.body.length)).toArray(function (err, result) {
            if (err)
                throw err;
            var json = {};
            var data = [];
            for (var i in result) {
                var sr_num = i;
                var childarray = {};
                childarray._id = ++sr_num;
                childarray.gst_slabs = result[i].gst_slabs;
                childarray.gst_rate = result[i].gst_rate;
                ;
                childarray.action = '<a class="btn btn-success btn-sm a-inside editGST" data-id="' + result[i]._id + '">Edit</a>\
                                            <a class="btn btn-danger btn-sm a-inside deleteGST" data-id="' + result[i]._id + '">Delete</a>';
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
    req.check('gst_slabs', 'GST slabs name required').notEmpty();
    req.check('gst_rate', 'GST rate name required').notEmpty();
    var errors = req.validationErrors();
    var json = {};
    if (errors) {
        json['error'] = 1;
        json['error_mess'] = errors;
    } else {
        var insertData = {
            gst_slabs: req.body.gst_slabs,
            gst_rate: req.body.gst_rate,
        };
        if (req.body.gst_id.length == 0) {
            GST.insertOne(insertData, function (err, res) {
                if (err)
                    throw err;
            });
            json['success_mess'] = "Insert Records successfully!";
        } else {
            GST.updateOne({_id: new ObjectId(req.body.gst_id)}, {"$set": insertData}, function (err, res) {
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
    var whereCond = {_id: new ObjectId(req.body.gst_id)};
    GST.findOne(whereCond, function (err, result) {
        if (err)
            throw err;
        var json = {};
        if (result) {
            json['success'] = 1;
            json['success_mess'] = "loaded..";
            json['result'] = result;
        } else {
            json['error'] = 1;
            json['error_mess'] = "Some thing error Please try again";
        }
        res.send(json);
    });
};



exports.deletegst = function (req, res, next) {
    var whereCon = {_id: new ObjectId(req.body.gst_id)};
    GST.deleteOne(whereCon, function (err, result) {
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
