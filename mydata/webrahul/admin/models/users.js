var mongodbCon = require('../../db.js');

var tbl_name = "users";
var UserConn = {};

mongodbCon(function (err, db) {
    if (err)
        throw err;
    UserConn = db.collection(tbl_name);
});


exports.userlist = function (req, res) {
    UserConn.find({}).toArray(function (err, result) {
        if (err)
            throw err;
            //console.log(result);
        res.render('customers', {page_title: "Customers - Node.js", data: result});
    });
};


exports.signup = function (req, res) {
    req.check('first_name', 'Shop Name is required').notEmpty();
    req.check('last_name', 'Shop Name is required').notEmpty();
    req.check('email', 'Shop Id is required').notEmpty();
    req.check('pass', 'Password is required').notEmpty().equals(req.body.conf_pass);
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    } else {
        var insertData = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            user_pass: req.body.pass,
            status: 1,
            created_at: new Date(),
            updated_at: new Date()
        };
        UserConn.insertOne(insertData, function (err, res) {
            if (err)
                throw err;
        });
        var json = {};
        json['success'] = 1;
        json['success_mess'] = "Insert Records successfully !";
        res.send(json);
    }
};
