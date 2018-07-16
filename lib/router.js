/**
 * Routes the request to the desired route
 */

/**
 * Dependencies
 */

// Node

// Project
const users = require('./controllers/users');
const products = require('./controllers/products');
const tokens = require('./controllers/tokens');
const orders = require('./controllers/orders');
const basket = require('./controllers/basket');


// Object container
const router = {};

router.controllers = {
    'users': users,
    'products': products,
    'tokens': tokens,
    'orders': orders,
    'basket': basket
}

/**
 * Redirects the request to the correct controller
 * StatusCode:
 *      404 if the controller or method don't exist
 * 
 * @param { object } data 
 * @param { function } callback 
 */
router.enroute = function(data,callback)
{    
    if(
        typeof(data) === 'object'
        && typeof(router.controllers[data.route]) === 'object'
    )
    {
        if(
            router.controllers[data.route].methods.indexOf(data.method) > -1 
            && typeof(router.controllers[data.route][data.method]) === 'function'    
        ) {
            router.controllers[data.route][data.method](data,callback);
        } else {
            callback({code:405, message: 'method not allowed'}); // Method not found for endpoint
        }
        
    } else {
        callback({code:404, message: 'endpoint not found'}); // Endpoint not found
    }
}

/**
 * Module exports
 */
module.exports = {
    "enroute": router.enroute
};

