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
    return  bcrypt.compare(usersend, actual, function (err, res) {
        if (err)
            throw err;

        return 'success';
    });
}


exports.login = function (req, res) {
    var sess = req.session;
    if (typeof sess.email != "undefined")
    {
        res.redirect('admin/afterlogin');
    }
    if (req.method.toLowerCase() != "post") {
        res.render("login", {layout: false});
        //res.render('userslist', {page_title: "Customers - Node.js", data: result});
    }
    else {

        req.check('username', 'User name does not appear to be valid').notEmpty();
        req.check('pass', 'Password is required').notEmpty();
        var errors = req.validationErrors();
        if (errors) {

            res.render('login', {page_title: "login", errors: errors});
        } else {

            var whereCond = {
                username: req.body.username,
            };
            adminConn.findOne(whereCond, function (err, result) {
                if (err)
                    throw err;

                if (result) {
                    var checkval = check_pass(req.body.pass, result.password);
                    if (checkval) {
                        console.log(checkval);
                    } else {
                        console.log(checkval);
                    }
                    //sess.username = req.body.username;
                    res.redirect('admin/afterlogin');
                } else {
                    var errormsg = "username password nor match!"
                    res.render('login', {page_title: "login", errormsg: errormsg});
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
