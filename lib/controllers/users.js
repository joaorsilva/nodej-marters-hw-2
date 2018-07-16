/**
 * User controller
 */

/**
 * Dependencies
 */

// Node

// Project
const UserService = require('../services/users');

// Object container
const users = {};
const service = new UserService();

/**
 * Enroutes users request to the correspondent action
 */
users.methods = [
    'get',
    'post',
    'put',
    'delete'
]; 

/**
 * Returns one user
 * @param {object} data 
 * @param {function} callback
 */
users.get = function(data,callback) 
{
    service.read(data.headers.token,callback);
};

/**
 * Creates a new user.
 * @param {object} data 
 * @param {function} callback
 */
users.post = function(data,callback) {
    service.create(data.data,data.headers.token,callback);
};

/**
 * Updates an existing user.
 * @param {object} data 
 * @param {function} callback
 */
users.put = function(data,callback) {
    service.update(data.data,data.headers.token,callback);
};

/**
 * Updates an existing user.
 * @param {object} data 
 * @param {function} callback
 */
users.delete = function(data,callback) {
    service.delete(data.headers.token,callback);
};

/**
 * Module exports
 */
module.exports = users;