require('@google-cloud/debug-agent').start();
var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var session = require('express-session');

/*     ====>  SELLER MODULE    <====            */

var sellershop = require('./api/seller/shops');
var selleritems = require('./api/seller/items');
var sellerorder = require('./api/seller/orders');
var sellernotifications = require('./api/seller/notification');


/*      ===>  BUYER MODULE <====            */

var buyeruser = require('./api/buyer/users');
var buyershop = require('./api/buyer/shops');
var buyeritem = require('./api/buyer/items');
var buyerorder = require('./api/buyer/orders');
var buyercart = require('./api/buyer/cart');
var buyerfavorites = require('./api/buyer/favorites');


/*     ====>  ADMIN MODULE    <====         */

//var adminSL = require('./admin/models/admin');
var adminuser = require('./admin/models/users');
var adminauth = require('./admin/models/auth');
var admincat = require('./admin/models/categories');
var adminshop = require('./admin/models/shops');
var adminbuyer = require('./admin/models/buyers');
var adminorder = require('./admin/models/orders');
var adminitem = require('./admin/models/items');
var admingst = require('./admin/models/gst');
var adminunit = require('./admin/models/unit');
//var adminitem = require('./admin/models/items');

var app = express();
//app.use(session({secret: 'mukesh'}));
app.use(session({
    secret: 'mukesh123',
    proxy: true,
    resave: true,
    saveUninitialized: true
}));

var connection = require('express-myconnection');
var mongodb = require('mongodb');

app.set('views', path.join(__dirname, 'admin/views'));
app.set('view engine', 'ejs');
// all environments
app.set('port', process.env.PORT || 8080);

app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json())
app.use(validator());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/public'));

var multer = require('multer');
var getFields = multer();

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

/*------------------------------------------
 Authentication management routes for seller
 -------------------------------------------*/
app.post('/seller/login', sellershop.login);
app.post('/seller/signup', sellershop.signup);
app.post('/seller/changepassword', sellershop.changepassword);
app.post('/seller/forgot', sellershop.forgot);
app.post('/seller/resetpassword', sellershop.resetpassword);
app.post('/seller/validaterecords', sellershop.validarecords);
app.post('/seller/shopedit', sellershop.shopedit);
app.post('/seller/shopdetail', sellershop.shopdetail);
app.post('/seller/deleteshop', sellershop.deleteshop);




/*------------------------------------------
 Routes for seller
 -------------------------------------------*/

app.get('/seller/item/upload', selleritems.upload);
app.post('/seller/item/fileupload', selleritems.fileupload);
app.post('/seller/item/list', selleritems.list);
app.post('/seller/item/add', selleritems.add);
app.post('/seller/item/delete', selleritems.delete);
app.post('/seller/item/edit', selleritems.edit);
app.post('/seller/item/details', selleritems.details);
app.get('/seller/item/categorylist', selleritems.categorylist);
app.get('/seller/item/unitslist', selleritems.unitslist);
app.get('/seller/item/get-gst', selleritems.get_gst);


app.post('/seller/order/list', sellerorder.list);
app.post('/seller/order/edit', sellerorder.orderedit);
app.post('/seller/order/ordertimeedit', sellerorder.ordertimeedit);
app.post('/seller/order/pendding', sellerorder.pendding_list);
app.post('/seller/order/details', sellerorder.details);

app.post('/seller/notify', sellernotifications.sendnoti);


/*------------------------------------------
 Routes for Buyer
 -------------------------------------------*/

app.post('/buyer/login', buyeruser.login);
app.post('/buyer/signup', buyeruser.signup);
app.post('/buyer/changepassword', buyeruser.changepassword);
app.post('/buyer/forgot', buyeruser.forgot);
app.post('/buyer/resetpassword', buyeruser.resetpassword);

app.post('/buyer/find-shop', buyershop.find_shop);
app.post('/buyer/find-shop-by-name', buyershop.find_shop_by_name);
app.post('/buyer/find-shop-name', buyershop.find_shop_name);
app.post('/buyer/find-item-list', buyeritem.find_item_list);
app.post('/buyer/item-details', buyeritem.item_details);
app.post('/buyer/search-item-list', buyeritem.search_item_list);



app.post('/buyer/add-cart', buyercart.add_cart);
app.post('/buyer/edit-cart', buyercart.update_cart);
app.post('/buyer/my-cart', buyercart.my_cart);
app.post('/buyer/delete-cart-item', buyercart.delete_cart_item);

app.post('/buyer/add-favorites', buyerfavorites.add_favorites);
app.post('/buyer/my-favorites', buyerfavorites.my_favorites);
app.post('/buyer/delete-favorites-item', buyerfavorites.delete_favorites_item);

app.post('/buyer/add-order', buyerorder.add_order);
app.post('/buyer/my-orders', buyerorder.my_orders);
app.post('/buyer/cancel-orders', buyerorder.cancel_order);



//app.post('/buyer/getcart-details', buyercart.cart_details);


/*------------------------------------------
 Routes for Admin
 -------------------------------------------*/

function requireLogin(req, res, next) {
    if (req.session.email) {
        next(); // allow the next route to run
    } else {
        // require the user to log in
        res.redirect("/admin/login"); // or render a form, etc.
    }
}

// Automatically apply the `requireLogin` middleware to all
// routes starting with `/admin`
//app.all("/admin/*", requireLogin, function(req, res, next) {
//  next(); // if the middleware allowed us to get here,
//          // just move on to the next route handler
//}); 


//app.get('/admin/users' , requireLogin, adminuser.userlist);

app.get('/admin/users', adminuser.userlist);
app.get('/admin/login', adminauth.login);
app.post('/admin/login', adminauth.login);
app.get('/admin/afterlogin', adminauth.afterlogin);
app.get('/admin/afterlogin', adminauth.afterlogin);

app.post('/admin/testpassword', adminauth.testpassword);
app.post('/admin/checkpassword', adminauth.checkpassword);


app.get('/admin/shops', adminshop.list);
app.post('/admin/shops/ajaxlist', adminshop.ajaxlist);
app.post('/admin/shops/addnew', adminshop.addnew);
app.post('/admin/shops/getContent', adminshop.getContent);
app.post('/admin/shops/deleteshop', adminshop.deleteshop);

app.get('/admin/buyers', adminbuyer.list);
app.post('/admin/buyers/ajaxlist', adminbuyer.ajaxlist);
app.post('/admin/buyers/addnew', adminbuyer.addnew);
app.post('/admin/buyers/getContent', adminbuyer.getContent);
app.post('/admin/buyers/deletebuyer', adminbuyer.deletebuyer);

app.get('/admin/orders', adminorder.list);
app.post('/admin/orders/ajaxlist', adminorder.ajaxlist);
app.post('/admin/orders/addnew', adminorder.addnew);
app.post('/admin/orders/getContent', adminorder.getContent);
app.post('/admin/orders/deleteorder', adminorder.deleteorder);

app.get('/admin/items', adminitem.list);
app.post('/admin/items/ajaxlist', adminitem.ajaxlist);
app.post('/admin/items/addnew', adminitem.addnew);
app.post('/admin/items/getContent', adminitem.getContent);
app.post('/admin/items/deleteitem', adminitem.deleteitem);

app.get('/admin/categories', admincat.list);
app.post('/admin/categories/ajaxlist', admincat.ajaxlist);
app.post('/admin/categories/addnew', admincat.addnew);
app.post('/admin/categories/getContent', admincat.getContent);
app.post('/admin/categories/deleteCat', admincat.deleteCat);

app.get('/admin/units', adminunit.list);
app.post('/admin/units/ajaxlist', adminunit.ajaxlist);
app.post('/admin/units/addnew', adminunit.addnew);
app.post('/admin/units/getContent', adminunit.getContent);
app.post('/admin/units/deleteUnit', adminunit.deleteUnit);

app.get('/admin/g-s-t', admingst.list);
app.post('/admin/g-s-t/ajaxlist', admingst.ajaxlist);
app.post('/admin/g-s-t/addnew', admingst.addnew);
app.post('/admin/g-s-t/getContent', admingst.getContent);
app.post('/admin/g-s-t/deletegst', admingst.deletegst);




app.get('*', function (req, res) {
    res.send('404 page not found.', 404);
});

app.use(app.router);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
