/**
 * User controller
 */

/**
 * Dependencies
 */

// Node

// Project
const BasketService = require('../services/basket');

// Object container
const basket = {};
const service = new BasketService();

/**
 * Enroutes users request to the correspondent action
 */
basket.methods = [
    'get',
    'put',
    'delete'
]; 

/**
 * Returns the basket
 * @param {object} data 
 * @param {function} callback
 */
basket.get = function(data,callback) 
{
    service.read(data.headers.token,callback);
};

/**
 * Updates an existing basket product.
 * @param {object} data 
 * @param {function} callback
 */
basket.put = function(data,callback) {
    service.update(data.data,data.headers.token,callback);
};

/**
 * Deletes one product or all products from the basket.
 * @param {object} data 
 * @param {function} callback
 */
basket.delete = function(data,callback) {
    service.delete(data.query.id,data.headers.token,callback);
};

/**
 * Module exports
 */
module.exports = basket;