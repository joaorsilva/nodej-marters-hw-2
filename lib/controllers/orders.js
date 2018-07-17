/**
 * orders controller
 */

/**
 * Dependencies
 */

// Node

// Project
const OrdersService = require('../services/orders');
const helpers = require('../helpers');

// Object container
const orders = {};
const service = new OrdersService();

orders.id = "";
orders.user = "";
orders.products = [];
orders.invoice = "";

/**
 * Enroutes orders request to the correspondent action
 */
orders.methods = [
    'get',
    'post'
]; 

/**
 * Returns one order
 * @param {object} data 
 * @param {function} callback
 */
orders.get = function(data,callback) 
{   
    service.read(helpers.validateQueryId(data),data.headers.token,callback);
};

/**
 * Creates a new order.
 * @param {object} data 
 * @param {function} callback
 */
orders.post = function(data,callback) 
{
    service.create(data.headers.token,data.data,callback);
};

/**
 * Module exports
 */
module.exports = orders;