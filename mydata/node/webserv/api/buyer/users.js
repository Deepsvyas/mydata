var mongodbCon = require( '../../db.js' );
var ObjectId = require('mongodb').ObjectId;

var tbl_name = "users";
var UserConn = {};

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'yotechsupp@gmail.com',
        pass: 'wvrfahuhxmmnxtdy'
    }
});;

mongodbCon(function (err, db) {
    if (err)
        throw err;
    UserConn = db.collection(tbl_name);
});

exports.login = function (req, res) {
    req.check('email', 'Email does not appear to be valid').isEmail();
    req.check('pass', 'Password is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    } else {
        var whereCond = {
            email: req.body.email,
            user_pass: req.body.pass,
            status: 1
        };
        UserConn.findOne(whereCond, function (err, result) {
            if (err)
                throw err;
            var json = {};
            if (result) {

                var updateData = {
                    device_id: req.body.device_id,
                };
                UserConn.updateOne({_id: new ObjectId(result._id)}, {"$set": updateData}, function (err, ressf) {
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
    }
};


exports.signup = function (req, res) {
    req.check('first_name', 'First Name is required').notEmpty();
    req.check('last_name', 'Last Name is required').notEmpty();
    req.check('email', 'Email is required').notEmpty();
    req.check('pass', 'Password is required').notEmpty().equals(req.body.conf_pass);
    req.check('address', 'Address is required').notEmpty();
    req.check('contact_number', 'Contact Number is required').notEmpty();
    req.check('device_id', 'device id required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    } else {

        var whereCond = {
            email: req.body.email
        };

        UserConn.findOne(whereCond, function (err, fresult) {
            if (fresult) {
                var json = {};
                json['error'] = 1;
                json['error_msg'] = "Email already exists !";
                res.send(json);
            } else {

                var insertData = {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    user_pass: req.body.pass,
                    address: req.body.address,
                    contact_number: req.body.contact_number,
                    status: 1,
                    device_id: req.body.device_id,
                    created_at: new Date(),
                    updated_at: new Date()
                };
                UserConn.insertOne(insertData, function (err, result) {
                    if (err)
                        throw err;
                var json = {};
                json['success'] = 1;
                json['success_mess'] = "Insert Records successfully !";
                json['result'] = result.ops;
                res.send(json);
                });
            }
        });

    }
};


exports.changepassword = function (req, res) {
    req.check('password', 'password is required').notEmpty();
    req.check('userid', 'userid is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    } else {
        var updateData = {
            user_pass: req.body.password,
        };
        UserConn.updateOne({_id: new ObjectId(req.body.userid)}, {"$set": updateData}, function (err, res) {
            if (err)
                throw err;

        });
        var json = {};
        json['success'] = 1;
        json['success_mess'] = "Change password successfully";
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

        UserConn.findOne(whereCond, function (err, sresult) {

            if (sresult) {
                var rkey = randomString(4, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
                var updateData = {
                    resetkey: rkey,
                };
                UserConn.updateOne({_id: new ObjectId(sresult._id)}, {"$set": updateData}, function (err, ressf) {
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
    req.check('password', 'Password is required').notEmpty().equals(req.body.conf_password);
    req.check('key', 'key is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    } else {

        var whereCond = {
            resetkey: req.body.key,
            _id: new ObjectId(req.body.userid)
        };
        UserConn.findOne(whereCond, function (err, sresult) {
            if (sresult) {
                var updateData = {
                    user_pass: req.body.password
                };
                UserConn.updateOne({_id: new ObjectId(sresult._id)}, {"$set": updateData}, function (err, ressf) {
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