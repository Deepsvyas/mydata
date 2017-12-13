var FCM = require('fcm-push');
var serverkey = 'AAAAP3sk4eQ:APA91bEPLtwLw1xsjlLMcC15AJvqgHf-H-QtkfvwY24_iPw1cD5XfJfHD1eUYtkOuSDR6LTqQE4m53ziyioy37-Y9DGu1tVS18FtScpQIu_4VDfM6tbb2qtRUntETcDmT12pCyZeLn8_';
var fcm = new FCM(serverkey);



exports.sendnoti = function (req, res) {
    
    var message = {//this may vary according to the message type (single recipient, multicast, topic, et cetera)
    to: 'fGwiHNWDGqU:APA91bHX_fgAa20bLPD9E_YHKSRPxRyk5O8uRAEc-2nxmoW69ObkBCbz5E2uqG0eJcOfVNUH-seB5MYKSuAdvSKSTGRTD5qLQmVnmVgtq7_jnSC9pPnSXLt4eOoTe67f7M9M1MgCOZam',
    //collapse_key: 'your_collapse_key',
    notification: {
        title: 'mukesh send',
        body: 'mukesh send message'
    },
    data: {//you can send only notification or only data(or include both)
        my_key: 'my value',
        my_another_key: 'my another value'
    }
};
    
    fcm.send(message, function (err, response) {
        if (err) {
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
    
    
};