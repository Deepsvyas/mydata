var mongodbCon = require('../../db.js');
var ObjectId = require('mongodb').ObjectId;
var tbl_name = "shops";

var Shop = {};

mongodbCon(function (err, db) {
    if (err)
        throw err;
    Shop = db.collection(tbl_name);
    Category = db.collection('categories');
});


exports.list = function (req, res, next) {
    getCateories(Category, function (categories) {
        res.render('shop/list', {page_title: "Shops | Admin", 'categories': categories, shop:true});
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
    Shop.find({shop_name: {$regex: ".*" + searchval.trim() + ".*", $options: 'i'}}).toArray(function (err, counts) {
        count = counts.length;
        Shop.find({shop_name: {$regex: ".*" + searchval.trim() + ".*", $options: 'i'}}).sort(sortjson).skip(parseFloat(req.body.start)).limit(parseFloat(req.body.length)).toArray(function (err, result) {
            if (err)
                throw err;
            var json = {};
            var data = [];
            getCateories(Category, function (categories) {

                for (var i in result) {
                    var sr_num = i;
                    var childarray = {};
                    childarray._id = ++sr_num;
                    childarray.shop_name = result[i].shop_name;
                    childarray.shop_id = result[i].shop_id;
                    childarray.email = result[i].email;
                    childarray.contact_no = result[i].contact_no;
                    childarray.category_id = (typeof categories[result[i].category_id] != "undefined") ? categories[result[i].category_id] : "---";
                    childarray.bankdetails = '<a class=" bankdetails" data-account_name="' + result[i].account_name + '" data-account_number="' + result[i].account_number + '" data-bank_name="' + result[i].bank_name + '" data-branch_name="' + result[i].branch_name + '" data-ifcs_code="' + result[i].ifcs_code + '">bank details</a>';
                    childarray.action = '<a class="btn btn-success btn-sm a-inside editShop" data-id="' + result[i]._id + '">Edit</a>\
                                            <a class="btn btn-danger btn-sm a-inside deleteShop" data-id="' + result[i]._id + '">Delete</a>';
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
    req.check('shop_name', 'shop name required').notEmpty();
    req.check('email', 'email required').isEmail();
    req.check('shop_id', 'shop_id required').notEmpty();
    req.check('contact_no', 'contact_no required').isMobilePhone("en-GB");
    req.check('category', 'category required').notEmpty();
    //req.check('location', 'location required').notEmpty();
    req.check('shop_available', 'shop_available required').notEmpty();
    req.check('account_name', 'account_name required').notEmpty();
    req.check('account_number', 'account_number required').isInt();
    req.check('bank_name', 'bank_name required').notEmpty();
    req.check('branch_name', 'branch_name required').notEmpty();
    req.check('ifcs_code', 'ifcs_code required').notEmpty();
    req.check('gst_no', 'gst_no required').notEmpty();
//    req.check('shop_open_time', 'shop_open_time required').notEmpty();
//    req.check('shop_end_time', 'shop_end_time required').notEmpty();
    if (req.body.shopid.length == 0) {
        req.check('password', 'password required').notEmpty().equals(req.body.conf_password);
    }
    var errors = req.validationErrors();
    var json = {};
    if (errors) {
        json['error'] = 1;
        json['error_mess'] = errors;
        res.send(json);
    } else {
        var insertData = {
            shop_name: req.body.shop_name,
            email: req.body.email,
            shop_id: req.body.shop_id,
            contact_no: req.body.contact_no,
            home_delivery: req.body.home_delivery,
            category_id: req.body.category,
            status: 1,
            //location: req.body.location,
            created_at: "",
            updated_at: "",
            shop_days_open: req.body.shop_days_open,
            shop_open_time: req.body.shop_open_time,
            shop_end_time: req.body.shop_end_time,
            shop_available: req.body.shop_available,
            account_name: req.body.account_name,
            account_number: req.body.account_number,
            bank_name: req.body.bank_name,
            branch_name: req.body.branch_name,
            ifcs_code: req.body.ifcs_code,
            gst_no: req.body.gst_no,
            shop_password: req.body.password
        };
console.log(insertData);

        if (req.body.shopid.length == 0) { 
            var whereCond = {
                email: req.body.email.toLowerCase()
            };
            Shop.count(whereCond, function (err, fresult) {               
                if (fresult) {
                    json['error'] = 2;
                    json['error_mess'] = "Email already exists !";
                    res.send(json);                    
                } else {

                    Shop.insertOne(insertData, function (err, result) {
                        if (err)
                            throw err;
                        var json = {};
                        json['success'] = 1;
                        json['success_mess'] = "Insert records successfully !";
                        res.send(json);
                    });
                }
            });

        } else {
            var whereCond = {
                email: req.body.email.toLowerCase(),
                _id: { $ne: new ObjectId(req.body.shopid)}
            };
            Shop.findOne(whereCond, function (err, fresult) {
                if (fresult) {
                    json['error'] = 2;
                    json['error_mess'] = "Email already exists !";
                    res.send(json);                    
                } else {

                    Shop.updateOne({_id: new ObjectId(req.body.shopid)}, {"$set": insertData}, function (err, res) {
                    if (err)
                        throw err;
                    });
                    json['success'] = 1;
                    json['success_mess'] = "Updated Records successfully !";
                    res.send(json);
                }           
            });    
        }      
    }
};

exports.getContent = function (req, res, next) {
    var whereCond = {_id: new ObjectId(req.body.shopid)};
    Shop.findOne(whereCond, function (err, result) {
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



exports.deleteshop = function (req, res, next) {
    var whereCon = {_id: new ObjectId(req.body.shopid)};
    Shop.deleteOne(whereCon, function (err, result) {
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
            categories[''] = "Please select"; 
            for(var i in result){
                categories[result[i]._id] = result[i].categoryname;
            }
            callback(categories);
        }
    });
}
