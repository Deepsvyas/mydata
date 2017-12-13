var mongodbCon = require('../../db.js');
var ObjectId = require('mongodb').ObjectId;
var tbl_name = "users";

var Buyer = {};

mongodbCon(function (err, db) {
    if (err)
        throw err;
    Buyer = db.collection(tbl_name);
});


exports.list = function (req, res, next) {
    res.render('buyer/list', {page_title: "Buyers | Admin", buyer:true});
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
    Buyer.find({address: {$regex: ".*" + searchval.trim() + ".*", $options: 'i'}}).toArray(function (err, counts) {
        count = counts.length;
        Buyer.find({address: {$regex: ".*" + searchval.trim() + ".*", $options: 'i'}}).sort(sortjson).skip(parseFloat(req.body.start)).limit(parseFloat(req.body.length)).toArray(function (err, result) {
            if (err)
                throw err;
            var json = {};
            var data = [];
            for (var i in result) {
                var sr_num = i;
                var childarray = {};
                childarray._id = ++sr_num;
                childarray.user_name = result[i].first_name + " " + result[i].last_name;
                childarray.email = result[i].email;
                childarray.contact_number = result[i].contact_number;
                childarray.address = result[i].address;
                childarray.created_at = display_date(result[i].created_at);
                childarray.action = '<a class="btn btn-success btn-sm a-inside editBuyer" data-id="' + result[i]._id + '">Edit</a>\
                                            <a class="btn btn-danger btn-sm a-inside deleteBuyer" data-id="' + result[i]._id + '">Delete</a>';
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
};

exports.addnew = function (req, res, next) {
    req.check('first_name', 'first name required').notEmpty();
    req.check('last_name', 'last name required').notEmpty();
    req.check('email', 'valid email required').isEmail();
    req.check('contact_no', 'valid contact Num required').isMobilePhone("en-GB");
    if (req.body.buyer_id.length == 0) {
        req.check('password', 'password required').notEmpty().equals(req.body.conf_password);
    }
    req.check('address', 'address required').notEmpty();
    var errors = req.validationErrors();
    var json = {};
    if (errors) {
        json['error'] = 1;
        json['error_mess'] = errors;
        res.send(json);
    } else {
        var insertData = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email.toLowerCase(),
            user_pass: req.body.password,
            address: req.body.address,
            contact_number: req.body.contact_no,
            status: 1,
            created_at: new Date(),
            updated_at: new Date()
        };


        if (req.body.buyer_id.length == 0) {
            var whereCond = {
                email: req.body.email.toLowerCase()
            };
            Buyer.count(whereCond, function (err, fresult) {
                if (fresult) {
                    json['success'] = 0;
                    json['success_mess'] = "Email already exists !";
                    console.log('1' + json);
                    res.send(json);
                } else {

                    Buyer.insertOne(insertData, function (err, res) {
                        if (err)
                            throw err;
                    });
                    json['success'] = 1;
                    json['success_mess'] = "Insert records successfully !";
                    console.log('2' + json);
                    res.send(json);
                }
            });

        } else {
            var whereCond = {
                email: req.body.email.toLowerCase(),
                _id: {$ne: new ObjectId(req.body.buyer_id)}
            };
            Buyer.findOne(whereCond, function (err, fresult) {
                //var json = {};
                console.log(fresult);
                if (fresult) {
                    json['success'] = 0;
                    json['success_mess'] = "Email already exists !";
                    console.log('1' + json);
                    res.send(json);
                } else {

                    Buyer.updateOne({_id: new ObjectId(req.body.buyer_id)}, {"$set": insertData}, function (err, res) {
                        if (err)
                            throw err;
                    });
                    json['success'] = 1;
                    json['success_mess'] = "Updated Records successfully !";
                    console.log('3' + json);
                    res.send(json);
                }
            });

        }

        // json['success'] = 0;
        // json['success_mess'] = "Something went wrong!";       
    }
    // console.log('3'+json);
    // console.log(json);
    // res.send(json);
};


exports.getContent = function (req, res, next) {
    var whereCond = {_id: new ObjectId(req.body.buyer_id)};
    Buyer.findOne(whereCond, function (err, result) {
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



exports.deletebuyer = function (req, res, next) {
    var whereCon = {_id: new ObjectId(req.body.buyer_id)};
    Buyer.deleteOne(whereCon, function (err, result) {
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

function display_date(date) {
    var date = new Date(date);
    return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
}
