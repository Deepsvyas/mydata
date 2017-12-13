var mongodbCon = require('../../db.js');
var tbl_name = "admin";
var UserConn = {};

mongodbCon(function (err, db) {
    if (err)
        throw err;
    UserConn = db.collection(tbl_name);
});

exports.login = function (req, res) {
    var sess = req.session;
    console.log(sess.email);
    if (typeof sess.email!="undefined")
    {
        res.redirect('admin/afterlogin');
    }
    if (req.method.toLowerCase() != "post") {
        res.render("login", {layout: false});
        //res.render('userslist', {page_title: "Customers - Node.js", data: result});
    }
    else {
        sess.email = 'admin@gmail.com';
        res.redirect('admin/afterlogin');
//        req.check('email', 'Email does not appear to be valid').isEmail();
//        req.check('pass', 'Password is required').notEmpty();
//        var errors = req.validationErrors();
//        if (errors) {
//            res.send(errors);
//            return;
//        } else {
//            var whereCond = {
//                email: req.body.email,
//                user_pass: req.body.pass,
//                status: 1
//            };
//            UserConn.find(whereCond).toArray(function (err, result) {
//                if (err)
//                    throw err;
//                var json = {};
//                if (result.length) {
//                    json['success'] = 1;
//                    json['success_mess'] = "your logging successfully";
//                    json['result'] = result;
//                } else {
//                    json['error'] = 1;
//                    json['error_mess'] = "Login Authentication failed";
//                }
//                res.render('userslist', {page_title: "Customers - Node.js", data: result});
//            });
//        }
    }
};


exports.afterlogin = function (req, res) {
     var sess = req.session;
    console.log(sess.email);
    res.render("thankyou", {layout: false});
};


