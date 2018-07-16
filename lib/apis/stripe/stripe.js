const config = require('../../../config/config');
const queryString = require('querystring');
const https = require('https');

const stripe = {};

stripe.validatePayment = function(paymentDetails, callback) 
{
    let payload = queryString.stringify(paymentDetails);
    let request = {
        'protocol': 'https:',
        'hostname': 'api.stripe.com',
        'method': 'POST',
        'path': '/v1/charges',
        'auth': config.apis.stripe.privKey + ":",
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-length': Buffer.byteLength(payload)
        }
    };
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
}

// stripe.validatePayment(null,null, function(err,data){
//     console.log(err,data);
// }); 

module.exports = stripe;