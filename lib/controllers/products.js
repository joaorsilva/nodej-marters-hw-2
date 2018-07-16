/**
 * User controller
 */

/**
 * Dependencies
 */

// Node

// Project
const ProductsService = require('../services/products');

// Object container
const products = {};
const service = new ProductsService();

/**
 * Enroutes users request to the correspondent action
 */
products.methods = [
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
products.get = function(data,callback) 
{
    service.read(data.query.id,callback);
};

/**
 * Creates a new user.
 * @param {object} data 
 * @param {function} callback
 */
products.post = function(data,callback) {
    service.create(data.data,data.headers.token,callback);
};

/**
 * Updates an existing user.
 * @param {object} data 
 * @param {function} callback
 */
products.put = function(data,callback) {
    service.update(data.query.id,data.data,data.headers.token,callback);
};

/**
 * Updates an existing products.
 * @param {object} data 
 * @param {function} callback
 */
products.delete = function(data,callback) {
    service.delete(data.query.id,data.headers.token,callback);
};

/**
 * Module exports
 */
module.exports = products;