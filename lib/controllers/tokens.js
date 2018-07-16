/**
 * Tokens controller
 */

/**
 * Dependencies
 */

// Node

// Project
const TokenService = require('../services/tokens');

// Object container
const tokens = {};
const service = new TokenService();

/**
 * Enroutes tokens request to the correspondent action
 */
tokens.methods = [
    'post',
    'delete'
]; 

/**
 * Creates a new token.
 * @param {object} data 
 * @param {function} callback
 */
tokens.post = function(data,callback) {
    service.create(data.data,callback);
};

/**
 * Updates an existing token.
 * @param {object} data 
 * @param {function} callback
 */
tokens.delete = function(data,callback) {
    service.delete(data.headers.token,callback);
};

/**
 * Module exports
 */
module.exports = tokens;