
/*
 * GET users listing.
 */

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://db_app_user:$BcJTB9SP^@35.186.159.4:27017/ecommerce_app";

// mongo connection in node js.


exports.login = function (req, res) {
    req.check('email', 'Email does not appear to be valid').isEmail();
    req.check('pass', 'Password is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    } else {
        MongoClient.connect(url, function (err, db) {
            if (err)
                throw err;

            var whereCond = {
                email: req.query.email,
                pass: req.query.pass
            };
            db.collection("users").find(whereCond).toArray(function (err, result) {
                if (err)
                    throw err;
                var json = {};
                if (result.length) {
                    json['success'] = 1;
                    json['success_mess'] = "your logging successfully";
                    json['result'] = result;
                } else {
                    json['error'] = 1;
                    json['error_mess'] = "Login Authentication failed";
                }
                res.send(json);
            });

        });
    }


};


exports.signup = function (req, res) {
    req.check('firstname', 'Password is required').notEmpty();
    req.check('lastname', 'Password is required').notEmpty();
    req.check('gender', 'Password is required').notEmpty();
    req.check('email', 'Email does not appear to be valid').isEmail();
    req.check('password', 'Password is required').notEmpty().equals(req.query.conf_password);
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    } else {
        MongoClient.connect(url, function (err, db) {
            if (err)
                throw err;
            var insertData = {
                firstname: req.query.firstname,
                lastname: req.query.lastname,
                email: req.query.email,
                pass: req.query.password,
                status: 1,
                gender: req.query.gender
            };
            db.collection("users").insertOne(insertData, function (err, res) {
                if (err)
                    throw err;
                var json = {};
                if (res.length) {
                    json['success'] = 1;
                    json['success_mess'] = "Insert Records successfully !";
                    json['result'] = res;
                } else {
                    json['error'] = 1;
                    json['error_mess'] = "Something error Please try agian !";
                }
                res.send(json);
            });


        });
    }
};
