var mongodbCon = require('../../db.js');
var bcrypt = require("bcrypt");

var ObjectId = require('mongodb').ObjectId;
var tbl_name = "shops";
var tbl_name1 = "categories";
var tbl_name2 = "testpassword";

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'yotechsupp@gmail.com',
        pass: 'wvrfahuhxmmnxtdy'
    }
});

//var transporter = nodemailer.createTransport({
//    service: 'gmail',
//    auth: {
//        user: 'mukesh.dode2810@gmail.com',
//        pass: 'bscavczyyhxwxrft'
//    }
//});



var shopConn = {};
mongodbCon(function (err, db) {
    if (err)
        throw err;
    shopConn = db.collection(tbl_name);
    categoryConn = db.collection(tbl_name1);
    testpassConn = db.collection(tbl_name2);

    db.collection(tbl_name).createIndex({location: "2dsphere"});
});
//shopConn.createIndex({location1: "2dsphere"});

exports.login = function (req, res) {
    req.check('shop_id', 'Shop Id is required').notEmpty();
    req.check('pass', 'Password is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    } else {

        var whereCond = {
            shop_id: req.body.shop_id,
            shop_password: req.body.pass
        };

        shopConn.aggregate([
            {
                $lookup:
                        {
                            from: "categories",
                            localField: "category_id",
                            foreignField: "_id",
                            as: "catgories_data"
                        }
            },
            {"$match": whereCond},
        ], function (err, result) {

            if (err)
                throw err;

            var json = {};
            if (result.length > 0) {


                var updateData = {
                    device_id: req.body.device_id,
                };
                shopConn.updateOne({_id: new ObjectId(result[0]["_id"])}, {"$set": updateData}, function (err, ressf) {
                    if (err)
                        throw err;

                });

                json['success'] = 1;
                json['success_mess'] = "your logging successfully";
                json['result'] = result;
            } else {
                json['error'] = 1;
                json['error_mess'] = "Login Authentication failed";
            }
            res.send(json);
        });




//        shopConn.findOne(aggregate([
//            {
//                $lookup:
//                        {
//                            from: "catgories",
//                            localField: "category_id",
//                            foreignField: "_id",
//                            as: "catgories_data"
//                        }
//            },
//            {"$match": whereCond},
//        ]), function (err, result) {
//
//            //});
//
//
//            // shopConn.findOne(whereCond, function (err, result) {
//            if (err)
//                throw err;
//
//            var json = {};
//            if (result) {
//
//                var updateData = {
//                    device_id: req.body.device_id,
//                };
//                shopConn.updateOne({_id: new ObjectId(result._id)}, {"$set": updateData}, function (err, ressf) {
//                    if (err)
//                        throw err;
//
//                });
//
//                json['success'] = 1;
//                json['success_mess'] = "your logging successfully";
//                json['result'] = result;
//
//
//            } else {
//                json['error'] = 1;
//                json['error_mess'] = "Login Authentication failed";
//            }
//            res.send(json);
//        });
    }
};


exports.signup = function (req, res) {
    req.check('shop_name', 'Shop Name is required').notEmpty();
    req.check('contactno', 'contact no is required').notEmpty();
    req.check('email', 'Email does not appear to be valid').isEmail();
    req.check('shop_id', 'Shop Id is required').notEmpty();
    req.check('categoryid', 'Category Id is required').notEmpty();
    req.check('shop_password', 'Password is required').notEmpty().equals(req.body.conf_password);
    req.check('home_delivery', 'Home delivery is required').notEmpty();
    req.check('lat', 'lat is required').notEmpty();
    req.check('lng', 'lng is required').notEmpty();
    req.check('gstno', 'gst no is required').notEmpty();
    
    req.check('device_id', 'device id required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    } else {
        shopConn.findOne({$or: [{shop_id: req.body.shop_id}, {email: req.body.email}]}, function (err, sresult) {
            if (sresult) {
                var json = {};
                json['error'] = 1;
                json['error_msg'] = "shop id already exists !";
                res.send(json);
            } else {
                var insertData = {
                    shop_name: req.body.shop_name,
                    email: req.body.email,
                    shop_id: req.body.shop_id,
                    shop_password: req.body.shop_password,
                    contact_no: req.body.contactno,
                    home_delivery: req.body.home_delivery,
                    gst_no: req.body.gstno,
                    category_id: new ObjectId(req.body.categoryid),
                    status: 1,
                    location: {type: "Point", coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)]},
                    device_id: req.body.device_id,
                    shopdelete: 0,
                    shop_available: "Yes",
                    created_at: new Date(),
                    updated_at: new Date()
                };
                shopConn.insertOne(insertData, function (err, result) {
                    if (err)
                        throw err;


                    var cateid = result["ops"][0]["category_id"];
                    categoryConn.findOne({_id: new ObjectId(cateid)}, function (err, cresult) {
                        if (err)
                            throw err;

                        var json = {};
                        json['success'] = 1;
                        json['success_mess'] = "Insert Records successfully !";
                        json['result'] = result.ops;
                        json['category'] = cresult;
                        res.send(json);
                    });
                });
            }
        });
    }
};

exports.shopdetail = function (req, res) {
    req.check('shopid', 'Shop Id is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    } else {

        shopConn.findOne({_id: new ObjectId(req.body.shopid)}, function (err, result) {
            if (err)
                throw err;
            //console.log(result);
            var json = {};
            if (result) {
                json['success'] = 1;
                json['success_mess'] = "shop details send";
                json['result'] = result;
            } else {
                json['error'] = 1;
                json['error_mess'] = "sorry shop id is not found!";
            }
            res.send(json);
        });

    }
};
exports.shopedit = function (req, res) {

    var updateData = {
        shop_days_open: req.body.shopdaysopen,
        shop_open_time: req.body.shopopentime,
        shop_end_time: req.body.shopendtime,
        shop_available: req.body.shopavailable,
        home_delivery: req.body.home_delivery,
        account_name: req.body.accountname,
        category_id: new ObjectId(req.body.categoryid),
        account_number: req.body.accountnumber,
        bank_name: req.body.bankname,
        branch_name: req.body.branchname,
        ifcs_code: req.body.ifcscode
    };
    shopConn.updateOne({_id: new ObjectId(req.body.shopid)}, {"$set": updateData}, function (err, res) {
        if (err)
            throw err;

    });
    var json = {};
    json['success'] = 1;
    json['success_mess'] = "Updated Records successfully !";
    res.send(json);
};

exports.changepassword = function (req, res) {
    req.check('password', 'password is required').notEmpty();
    req.check('shopid', 'shopid is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    } else {
        var updateData = {
            shop_password: req.body.password,
        };
        shopConn.updateOne({_id: new ObjectId(req.body.shopid)}, {"$set": updateData}, function (err, res) {
            if (err)
                throw err;

        });
        var json = {};
        json['success'] = 1;
        json['success_mess'] = "Change password successfully";
        res.send(json);
    }
};

exports.deleteshop = function (req, res) {
    req.check('shopid', 'shopid is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    } else {
        var updateData = {
            shopdelete: 1,
        };
        shopConn.updateOne({_id: new ObjectId(req.body.shopid)}, {"$set": updateData}, function (err, res) {
            if (err)
                throw err;

        });
        var json = {};
        json['success'] = 1;
        json['success_mess'] = "Request for shop delete successfully send";
        res.send(json);
    }
};

exports.forgot = function (req, res) {
    req.check('email', 'Email does not appear to be valid').isEmail();
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    } else {
        var whereCond = {
            email: req.body.email
        };

        shopConn.findOne(whereCond, function (err, sresult) {

            if (sresult) {
                var rkey = randomString(4, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
                var updateData = {
                    resetkey: rkey,
                };
                shopConn.updateOne({_id: new ObjectId(sresult._id)}, {"$set": updateData}, function (err, ressf) {
                    if (err)
                        throw err;
                    
                    var mailOptions = {
                        from: 'yotechsupp@gmail.com',
                        to: sresult.email,
                        subject: 'forgotpassword key',
                        text: 'please use following key for the forgot password: ' + rkey
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            throw err;
                        } else {
                            var json = {};
                            json['success'] = 1;
                            json['success_mess'] = "Please check your email";
                            json['result'] = sresult._id;
                            json['key'] = rkey;
                            //console.log(json);
                            res.send(json);
                        }
                    });
                });
            } else {
                var json = {};
                json['error'] = 1;
                json['error_mess'] = "email not found in records!";
                res.send(json);
            }
        });

    }

};


exports.resetpassword = function (req, res) {
    req.check('shop_password', 'Password is required').notEmpty().equals(req.body.conf_password);
    req.check('key', 'key is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    } else {

        var whereCond = {
            resetkey: req.body.key,
            _id: new ObjectId(req.body.shopid)
        };
        shopConn.findOne(whereCond, function (err, sresult) {
            if (sresult) {
                var updateData = {
                    shop_password: req.body.shop_password
                };
                shopConn.updateOne({_id: new ObjectId(sresult._id)}, {"$set": updateData}, function (err, ressf) {
                    if (err)
                        throw err;

                    var json = {};
                    json['success'] = 1;
                    json['success_mess'] = "password updated sucessfully!";
                    res.send(json);

                });
            } else {
                var json = {};
                json['error'] = 1;
                json['error_mess'] = "records not update please try again!";
                res.send(json);

            }

        });
    }
};



function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}


//exports.validarecords = function (req, res) {
//    
//    req.check('email', 'Email does not appear to be valid').isEmail();
//    req.check('shop_id', 'Shop Id is required').notEmpty();
//    var errors = req.validationErrors();
//    if (errors) {
//        res.send(errors);
//        return;
//    } else {
//        
//        var whereCond = {
//            email: req.body.email
//        };
//        
//         shopConn.findOne(whereCond, function (err, sresult) {
//             });
//    }
//    
//    };



exports.validarecords = function (req, res) {
    req.check('email', 'Email does not appear to be valid').isEmail();
    req.check('shop_id', 'Shop Id is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    } else {
        var json = {};

        shopConn.findOne({shop_id: req.body.shop_id}, function (err, sresult) {
            if (sresult) {
                shopConn.findOne({email: req.body.email}, function (err, eresult) {
                    if (eresult) {
                        json['error'] = 1;
                        json['shop_email_msg'] = "email address already exists !";
                        json['shop_id_msg'] = "shop id already exists !";
                        res.send(json);
                    } else {
                        json['error'] = 1;
                        json['shop_id_msg'] = "shop id already exists !";
                        res.send(json);
                    }
                });
            } else {
                shopConn.findOne({email: req.body.email}, function (err, eresult) {
                    if (eresult) {
                        json['error'] = 1;
                        json['shop_email_msg'] = "email address already exists !";
                        res.send(json);
                    } else {
                        json['error'] = 0;
                        json['shop_email_msg'] = "all is correct";
                        res.send(json);
                    }
                });
            }
        });

    }
};


exports.testpassword = function (req, res) {
    var newpass = req.body.password;
    var hashv = '';
    bcrypt.hash(newpass, 10, function (err, hash) {
        var insertData = {
            username: req.body.username,
            password: hash,
        };
        testpassConn.insertOne(insertData, function (err, result) {
            if (err)
                throw err;
            var json = {};
            json['success'] = 1;
            json['success_mess'] = "password add sucessfully!";
            res.send(json);
        });
    });
};



exports.checkpassword = function (req, res) {
    var hash = '$2a$10$6WlcnowaXMLT9kKlTr4yhuy0bCeTC7Z5fkUz7R8wlGsoyQSOR7jMu';
    bcrypt.compare('123456', hash, function(err, res) {  
        if(res) {  
            console.log("success");
        } else {
             console.log("failed");
    } });
};