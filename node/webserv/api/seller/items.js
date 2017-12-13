var mongodbCon = require('../../db.js');

var ObjectId = require('mongodb').ObjectId;
var tbl_name = 'items';
var tbl_name1 = 'categories';
var tbl_name2 = 'units';
var tbl_name3 = 'gst_slabs';
var itemConn = {};


mongodbCon(function (err, db) {
    if (err)
        throw err;
    itemConn = db.collection(tbl_name);
    cateConn = db.collection(tbl_name1);
    unitConn = db.collection(tbl_name2);
    gstConn = db.collection(tbl_name3);


});

//var formidable = require('formidable');
//var util = require('util');
//var fs = require('fs-extra');


// mongo connection in node js.
//var multer = require('multer');
//var fs = require('fs');
var crypto = require('crypto');

exports.upload = function (req, res) {

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="add" enctype="multipart/form-data" method="post">');
    res.write('<input type="text" name="item_name" value="dsf"><br>');
    res.write('<input type="text" name="category" value="dsf"><br>');
    res.write('<input type="text" name="price" value="dsf"><br>');
    res.write('<input type="text" name="until" value="dsf"><br>');
    res.write('<input type="text" name="available_qty" value="dsf"><br>');
    res.write('<input type="text" name="description" value="dsf"><br>');
    res.write('<input type="text" value="59bcf3fd0ebc302998c45e95" name="shopid"><br>');
    res.write('<input type="file" name="itemImage" multiple>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
};

exports.fileupload = function (req, res) {


    var storage = multer.diskStorage({
        destination: function (req, file, callback) {

            var dir = './uploads/12';

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            callback(null, dir);
        },
        filename: function (req, file, callback) {
            var extArray = file.mimetype.split("/");
            var extension = extArray[extArray.length - 1];
            var uploadfilename = randomValueHex(5) + '_' + Date.now() + "." + extension;
            callback(null, uploadfilename);
            return uploadfilename;
        }
    });
    var upload = multer({storage: storage}).array('itemImage', 5);
    upload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });

    console.log(upload);
};

exports.list = function (req, res) {

    var json = {};
    var whereCond = {
        shop_id: new ObjectId(req.body.shopid),
        sellerdelete: 0
    };

    itemConn.aggregate([
        {
            $lookup:
                    {
                        from: "units",
                        localField: "unit",
                        foreignField: "_id",
                        as: "units_data"
                    }

        },
        {
            $unwind: "$units_data"
        },
        {
            $lookup:
                    {
                        from: "gst_slabs",
                        localField: "gst_slabs",
                        foreignField: "_id",
                        as: "gst_data"
                    }
        },
        {
            $unwind: "$gst_data"
        }
        ,
        {
            $lookup:
                    {
                        from: "categories",
                        localField: "category_id",
                        foreignField: "_id",
                        as: "category_data"
                    }
        },
        {
            $unwind: "$category_data"
        }
        ,
        {"$match": whereCond},
        { $sort : { _id : -1} },
    ], function (err, result) {
    //itemConn.find(whereCond).toArray(function (err, result) {
        if (err)
            throw err;
        json['success'] = 1;
        json['success_mess'] = "load ...";
        json['result'] = result;
        res.send(json);
    });


};

exports.add = function (req, res) {

    req.check('item_name', 'item name required').notEmpty();
    req.check('price', 'Price is required').notEmpty();
    req.check('unit', 'Until is required').notEmpty();
    req.check('available_qty', 'Available Qty is required').notEmpty();
    req.check('description', 'Description is required').notEmpty();
    req.check('gstslabs', 'gst slabs is required').notEmpty();
    // req.check('img1', 'Item Image is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    } else {

        var insertData = {
            item_name: req.body.item_name,
            price: parseFloat(req.body.price),
            category_id: new ObjectId(req.body.categoryid),
            shop_id: new ObjectId(req.body.shopid),
            unit: new ObjectId(req.body.unit),
            available_qty: req.body.available_qty,
            description: req.body.description,
            gst_slabs: new ObjectId(req.body.gstslabs),
            img1: req.body.img1,
            img2: req.body.img2,
            img3: req.body.img3,
            img4: req.body.img4,
            img5: req.body.img5,
            sellerdelete: 0
        };
        itemConn.insertOne(insertData, function (err, res) {
            if (err)
                throw err;
        });
        var json = {};
        json['success'] = 1;
        json['success_mess'] = "Insert Records successfully !";
        res.send(json);


    }
};
exports.edit = function (req, res) {
    req.check('item_name', 'item name required').notEmpty();
    req.check('price', 'Price is required').notEmpty();
    req.check('unit', 'unit is required').notEmpty();
    req.check('description', 'Description is required').notEmpty();
    req.check('available_qty', 'Available Qty is required').notEmpty();
    req.check('description', 'Description is required').notEmpty();
    req.check('gstslabs', 'gst slabs is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    } else {

        var updateData = {
            item_name: req.body.item_name,
            price: parseFloat(req.body.price),
            unit: new ObjectId(req.body.unit),
            description: req.body.description,
            gst_slabs: new ObjectId(req.body.gstslabs),
            available_qty: req.body.available_qty,
            img1: req.body.img1,
            img2: req.body.img2,
            img3: req.body.img3,
            img4: req.body.img4,
            img5: req.body.img5,
            sellerdelete: 0
        };
        itemConn.updateOne({_id: new ObjectId(req.body.itemid)}, {"$set": updateData}, function (err, res) {
            if (err)
                throw err;

        });
        var json = {};
        json['success'] = 1;
        json['success_mess'] = "Updated Records successfully !";
        res.send(json);

    }
};
exports.delete = function (req, res) {

    var updateData = {
        sellerdelete: 1
    };
    itemConn.updateOne({_id: new ObjectId(req.body.itemid)}, {"$set": updateData}, function (err, res) {
        if (err)
            throw err;
    });
    var json = {};
    json['success'] = 1;
    json['success_mess'] = "Delete Records successfully !";
    res.send(json);

};
exports.details = function (req, res) {

    itemConn.findOne({_id: new ObjectId(req.body.itemid)}, function (err, result) {
        if (err)
            throw err;
        var json = {};
        json['success'] = 1;
        json['success_mess'] = "loaded...";
        json['result'] = result;
        res.send(json);
    });

};


exports.categorylist = function (req, res) {
    
        cateConn.find().toArray(function (err, result) {
            if (err)
                throw err;
            var json = {};
            json['success'] = 1;
            json['success_mess'] = "load ...";
            json['result'] = result;
            res.send(json);
        });
 
};




exports.unitslist = function (req, res) {
    
        unitConn.find().toArray(function (err, result) {
            if (err)
                throw err;
            var json = {};
            json['success'] = 1;
            json['success_mess'] = "load ...";
            json['result'] = result;
            res.send(json);
        });
    
};

exports.get_gst = function (req, res) {
    
    gstConn.find().toArray(function (err, result) {
        if (err)
            throw err;
        var json = {};
        json['success'] = 1;
        json['success_mess'] = "load ...";
        json['result'] = result;
        res.send(json);
    });

};


function randomValueHex(len) {
    return crypto.randomBytes(Math.ceil(len / 2))
            .toString('hex') // convert to hexadecimal format
            .slice(0, len);   // return required number of characters
}
