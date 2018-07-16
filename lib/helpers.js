/**
 * Helper functions
 * 
 */

/**
 * Dependencies
 */

// Node
const crypto = require('crypto');
const config = require('../config/config');
// Project

// Object container
const helpers = {};
 
/**
 * Parses a JSON string into a JSON object
 * @param {string} str 
 */
helpers.parseJsonToObject = function(str) 
{
    try {
        var obj = JSON.parse(str);
        return obj === null ? null : obj;
    } catch(e) {
        return false;
    };
};

helpers.validateQueryId = function(data)
{
    let id =
        typeof(data) === 'object'
        && typeof(data.query) == 'object'
        && typeof(data.query.id) === 'string' 
        && data.query.id.trim().length > 0 
        ? data.query.id.trim() 
        : false;
    return id;
}

helpers.validateEmail = function(email) 
{
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email) ? email : false;
}

helpers.uuid = function()
{
    return crypto.randomBytes(16).toString('hex');
}

helpers.hash = function(str) {
    if(typeof(str) == 'string' && str.length) {
        let hash = crypto.createHmac('sha256', config.secret).update(str).digest('hex');
        return hash;
    } else {
        return false;
    }
}

/**
 * Module exports
 */
module.exports = helpers;