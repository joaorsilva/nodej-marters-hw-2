/**
 * Mailgun send message
 */

const config = require('../../../config/config');
const queryString = require('querystring');
const https = require('https');

const mailgun = {};

mailgun.send = function(to,subject,message,callback)
{
    let messageData = {
        'from': "Mailgun Sandbox <" + config.apis.mailgun.user + "@" + config.apis.mailgun.account + ">",
        'to': to,
        'subject': subject,
        'html': message
    };

    //console.log(messageData);
    let payload = queryString.stringify(messageData);
    let request = {
        'protocol': 'https:',
        'hostname': 'api.mailgun.net',
        'method': 'POST',
        'path': `/v3/${config.apis.mailgun.account}/messages`,
        'auth': config.apis.mailgun.auth,
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-length': Buffer.byteLength(payload)
        }
    };

    //console.log(request);
    let req = https.request(request,function(res){
        //Grab the status of the sent request
        let status = res.statusCode;
        //Callback successfully if the request ok
        if(status == 200 || status == 201) {
            callback(false,{'code': status});
        } else {
            callback({'code': res.statusCode, 'message': res.statusMessage, 'data': null});
        }
    });

    //Bind to the the error event so it doesn't get throwned
    req.on('error', function(e) {
        callback({'code': 500, 'message': 'Internal server error', 'data': e});
        //callback(e);
    });

    //Add payload
    req.write(payload);
    //End the request
    req.end();   
};

// mailgun.send("joao.r.silva@gmail.com", "Test message", "<b>This is just a test</b>",function(err,data){
//     console.log(err,data);
// });

module.exports = mailgun;