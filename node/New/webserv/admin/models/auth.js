var mongodbCon = require('../../db.js');
var bcrypt = require("bcrypt");
var tbl_name = "adminuser";
var tbl_name2 = "testpassword";
var UserConn = {};

mongodbCon(function (err, db) {
    if (err)
        throw err;
    adminConn = db.collection(tbl_name);
    testpassConn = db.collection(tbl_name2);
});


function check_pass(usersend, actual)
{
    if (usersend == actual) {
        return true;
    } else {
        return false;
    }
}


exports.login = function (req, res) {
    var sess = req.session;
    if (typeof sess.loginemail != "undefined"){
        res.redirect('admin/dashboard');
    }
    
    
    if (req.method.toLowerCase() != "post") {
        res.render("login", {layout: false, page_title: "login" });
    } else {
        req.check('email', 'Email does not appear to be valid').notEmpty();
        req.check('pass', 'Password is required').notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            res.render('login', {page_title: "login", errors: errors});
        } else {

            var whereCond = {
                email: req.body.email,
            };
            adminConn.findOne(whereCond, function (err, result) {
                if (err)
                    throw err;
                if (result) {
                    var checkval = check_pass(req.body.pass, result.pass);
                    if (checkval) {
                        sess.loginemail = req.body.email;
                        res.redirect('admin/dashboard');
                    } else {
                        var errormsg = "username and password not match!"
                        res.render('login', {page_title: "login", errormsg: errormsg});
                    }
                }

            });
        }
    }
};


exports.afterlogin = function (req, res) {
    var sess = req.session;
    res.render("thankyou", {layout: false});
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

exports.logout = function (req, res) {
    req.session.destroy();
     res.redirect('admin/login');
};

exports.dashboard = function (req, res) {
    var sess = req.session;
    res.render("home/index", {layout: false, page_title: "Dashboard", dashboard:true});
};


exports.checkpassword = function (req, res) {
    var hash = '$2a$10$f9OKLmxPRtsuVdz6BoRHEereJmuz4exB2MUqFpHwDi/IQKalejuvi';
    bcrypt.compare('123456', hash, function (err, res) {
        if (res) {
            console.log("success");
        } else {
            console.log("failed");
        }
    });
};
