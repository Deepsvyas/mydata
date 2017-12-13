db.shops.insert({
    shop_name: "Techtran PEM"  
    email: "basuabhi92@gmail.com",
    shop_id: "priya2530",
    shop_password: "123456",
    contact_no: "9987654345",
    home_delivery: "Yes",
    category_id: ObjectId("59f440104c9101b65aa59fe5"),
    status: 1,
    location: {
        type: "Point",
        coordinates: [75.8742425, 22.7214731]
    },
    device_id: "fGwiHNWDGqU:APA91bHX_fgAa20bLPD9E_YHKSRPxRyk5O8uRAEc-2nxmoW69ObkBCbz5E2uqG0eJcOfVNUH-seB5MYKSuAdvSKSTGRTD5qLQmVnmVgtq7_jnSC9pPnSXLt4eOoTe67f7M9M1MgCOZam",
    shopdelete: 0,
    created_at: ISODate("2017-11-08T05:43:19.726Z"),
    updated_at: ISODate("2017-11-08T05:43:19.726Z"),
    shop_days_open: "",
    shop_open_time: "",
    shop_end_time: "",
    shop_available: "Yes",
    account_name: "",
    account_number: "",
    bank_name: "",
    branch_name: "",
    ifcs_code: "",
    gst_no: 221323232322323,
    resetkey: "FqiG"
})


db.shops.insert({
    shop_name: "mukesh",
    email: "mukesh@mobappys.com",
    shop_id: "12dwqw",
    shop_password: "123456",
    contact_no: "323232",
    home_delivery: "Yes",
    category_id: ObjectId("5a0aa2bb5d040f4b1ea74d52"),
    status: 1,
    location: {
        type: "Point",
        coordinates: [
            88.4635,
            22.5746
        ]
    },
    device_id: null,
    shopdelete: 0,
    created_at: ISODate("2017-11-07T14:08:52.218Z"),
    updated_at: ISODate("2017-11-07T14:08:52.218Z"),
    shop_days_open: "",
    shop_open_time: "",
    shop_end_time: "",
    shop_available: "Yes",
    account_name: "",
    account_number: "",
    bank_name: "",
    branch_name: "",
    ifcs_code: "",
    resetkey: "YYTZ"
});


db.pages.insert({heading : "Our Team", slug:"our_team", description: "this is our team page"})
db.pages.insert({categoryname : "Fashion"})

db.msr_admin.insert({email : "admin@xdeve.com", pass:123456});


gst_slabs

db.gst_slabs.insert(
   [{
      
        gst_slabs : "5% GST SLABS",
        gst_rate : "5%"
},
{
        gst_slabs : "12% GST SLABS",
        gst_rate : "12%"
},
{
        gst_slabs : "18% GST SLABS",
        gst_rate : "18%"
},
{
        gst_slabs : "28% GST SLABS",
        gst_rate : "28%"
}])


==========================

buyers


db.users.insert(
   [{
        first_name : "abhi",
        last_name : "basu",
        email : "basuabhi92@gmail.com",
        user_pass : "123456",
        address : "kaknzjwk",
        contact_number : "8892044941",
        status : 1,
        device_id : "fHprt8gbDfk:APA91bHi7T6fpaH13fmw-PJGpXykvTgcZqZuErdlgXAkdcSurj__CDTan9pAeW2O3rWV_udYPCZuihvb_iu5QUfCE9gncYUxloiX6q8OfHROE7SF-QVYRUCggQM-Wlw49K9QncimuExN",
        created_at : ISODate("2017-11-07T14:42:02.732Z"),
        updated_at : ISODate("2017-11-07T14:42:02.732Z")
},
{
        first_name : "Anurag",
        last_name : "Parashar",
        email : "anurag@mobappys.com",
        user_pass : "123456",
        address : "City center, Indore",
        contact_number : "9985425147",
        status : 1,
        device_id : "e4BJkAxLjlU:APA91bFFIJs3bNd2R5F2XxxSdZub9cQPN_rIX5NRFQeO4Qg1UmeUvx6Do4BCSxa3MYCdrGNVM0CB7yQ8pZ-vOEXhrVb87IWxCyzGTqEKjyO8upxReJZhyCNtBJnNT8a6QRFExDiNivqA",
        created_at : ISODate("2017-11-08T05:48:49.625Z"),
        updated_at : ISODate("2017-11-08T05:48:49.625Z"),
        resetkey : "feXX"
}]);


=====================================
units



db.units.insert(
   [{
        
        unitname : "per piece",
        status : 1
},
{
        unitname : "bulk",
        status : 1
},
{
        unitname : "kilogram",
        unitcode : "kg",
        status : 1
}])



=====================================


order 
{
        "_id" : ObjectId("5a098589da9f8b0005c57ead"),
        "shop_id" : ObjectId("5a029977798da400051826b4"),
        "order_number" : "O9Ja8f",
        "dishonour" : 0,
        "dispatch" : 0,
        "pickup" : 0,
        "user_id" : ObjectId("5a029ac1798da400051826b6"),
        "user_name" : "Anurag Parashar",
        "shipping_address" : "city centet,,Indore, MP, 452001",
        "phone_number" : "9985425147",
        "total_amount" : 210,
        "payment_id" : "pay_90wHk1gRv1N2Bp",
        "delivery_mode" : "Pick Up",
        "payment_status" : "Success",
        "delivery_date" : "",
        "delivery_time" : "",
        "itemsdetails" : [
                {
                        "item_id" : ObjectId("5a0422c06688b8000515ac3e"),
                        "item_name" : "USB Charger",
                        "description" : "USB Charger",
                        "before_price" : "Rs. 100",
                        "after_price" : "Rs. 210.0",
                        "quantity" : "2",
                        "gst_rate" : "5%",
                        "img" : ""
                }
        ],
        "cancel_by" : ""
}


====================

tables name

gst_slabs
items
orders
shops
units
users



=============================

"_id" 
            "shop_name" 
            "email" 
            "shop_id"
	"shop_password" 
            "contact_no" 
	"home_delivery" 
            "category_id" 
	"status"
            "location"
            "device_id" 
            "shopdelete" 
            "created_at" 
            "updated_at" 
	"shop_days_open" 
	"shop_open_time" 
	"shop_end_time" 
	"shop_available" 
	"account_name" 
	"account_number" 
	"bank_name" 
	"branch_name" 
	"ifcs_code" 
	"gst_no" 
	"resetkey" 
}



=============================

db.items.insert({
    "item_name" : "Toaster",
    "price" : 1000.5,
    "category_id" : ObjectId("5a0aa2b95d040f4b1ea74d51"),
    "shop_id" : ObjectId("5a029977798da400051826b4"),
    "unit" : ObjectId("59d34714cab5e465cfd18137"),
    "available_qty" : "10",
    "description" : "Sandwich toaster.",
    "gst_slabs" : ObjectId("59f2fd656e9990b7968b13ac"),
    "img1" : null,
    "img2" : null,
    "img3" : null,
    "img4" : null,
    "img5" : null,
    "sellerdelete" : 0
})