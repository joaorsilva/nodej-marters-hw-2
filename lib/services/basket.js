/**
 * Orders service class (logic implementation)
 */

/**
 * Dependencies
 */

// Node

// Project
const UsersModel = require('../models/users');
const TokensService = require('./tokens');
const ProductsModel = require('../models/products');

class BasketService {

    constructor()
    {
        this._model = new UsersModel();
        this._productsModel = new ProductsModel();
        this._tokensService = new TokensService();
    }
    /**
     * Reads one or more orders
     * Require Token: Yes
     * 
     * @param {string} token - Token string 
     * @param {function} callback - Callback function (err,data) 
     */
    read(token,callback)
    {
        let _this = this;
        this._tokensService.valid(token, function(err,tokenData) {
            if(!err && tokenData) {
                _this._model.read(tokenData.user,function(err,data) {
                    if(!err) {
                        if(typeof(data.basket) == 'object' && data.basket instanceof Array) {
                            callback(false,data.basket);
                        } else {
                            callback(false,[]);
                        }
                    } else {
                        callback(err);
                    }
                });
            } else {
                callback(err);
            }
        });
    }

    /**
     * Inserts or Updates products into the basket.
     * If the product id dosn't exists an error is returned.
     * If the product already exists in the basket the quantity is updated.
     * Require Token: Yes
     * 
     * @param {object} data - Product object to insert in the basket {id,qquantity}
     * @param {string} token - Token string 
     * @param {function} callback - Callback function (err,data)  
     */
    update(data, token, callback) 
    {
        let _this = this;
        // Checks if the user token is valid
        this._tokensService.valid(token, function(err,tokenData) {
            if(!err && tokenData) {
                // Gets the user record
                _this._model.read(tokenData.user,function(err,userData) {
                    if(!err && userData) {

                        // Sets the temporary basket as an empty array
                        let basket = [];
                        if(typeof(userData.basket) == 'object' && userData.basket instanceof Array) {
                            basket = userData.basket;
                        }

                        // Validates the product id to insert in the basket
                        data.id = 
                            typeof(data.id) === 'string' 
                            && data.id.trim().length === 32
                            ? data.id.trim()
                            : false;

                        if(!data.id) {
                            callback({'code': 400, 'message': 'Bad request', 'data':{'field':'id','message': 'invald'}});
                        } else {

                            // Validates the product quantity to insert in the basket
                            data.quantity = 
                                typeof(data.quantity) === 'number'
                                && data.quantity >= 1
                                ? data.quantity
                                : false;

                            if(!data.quantity) {
                                callback({'code': 400, 'message': 'Bad request', 'data':{'field':'quantity','message': 'invald'}});
                            } else {
                                // Reads the product record
                                _this._productsModel.read(data.id,function(err,productData) {
                                    if(!err && productData) {

                                        // Checks if the product id is already in the basket
                                        let basketProduct = basket.find(function(item) {
                                            if (item.id === productData.id) {
                                                return item
                                            }
                                        });

                                        // If the product is already in the basket update the quantity
                                        if(basketProduct) {
                                            basketProduct.quantity = data.quantity;
                                        } else {
                                            // If the product is not in the basket insert it
                                            basket.push({
                                                "id": productData.id,
                                                "name": productData.name,
                                                "price": productData.price,
                                                "quantity": data.quantity
                                            });
                                        }

                                        // Assigns the temporary basket to the basket value
                                        userData.basket = basket;

                                        // Updates the user basket where the basket resides
                                        _this._model.update(userData,callback);
                                    } else {
                                        callback(err);
                                    }
                                });
                            }
                        }
                    } else {
                        callback(err);
                    }
                });
            } else {
                callback(err);
            }
        });
    }

    /**
     * Deletes one product from the basket or clears it if 
     * no product id is specified.
     * Require Token: Yes
     * 
     * @param {string} product - Product id to remove from the basket or nothing to clear the basket
     * @param {string} token - Token string 
     * @param {function} callback - Callback function (err,data) 
     */
    delete(product, token, callback) 
    {
        let _this = this;
        let isProductInvalid = false;
        // Checks if the user token is valid
        this._tokensService.valid(token, function(err,tokenData) {
            if(!err && tokenData) {
                // Gets the user record
                _this._model.read(tokenData.user,function(err,userData) {
                    if(!err && userData) {

                        // If the is no product id, we clear the entire basket
                        let basket = [];
                        // We have something as a product
                        if(product) {

                            // Is it a valid product?
                            product = 
                                typeof(product) === 'string' 
                                && product.trim().length === 32
                                ? product.trim()
                                : false;
                            // If it is a valid product    
                            if(product) {
                                // If the basket is already an array lat's find the product and remove it
                                if(typeof(userData.basket) === 'object' && userData.basket instanceof Array) {
                                    basket = userData.basket.filter(function(item) {
                                        // Sanitize all prducts in the basket so we have only
                                        // well formed
                                        if(
                                            typeof(item) === 'object' 
                                            && typeof(item.id) === 'string'
                                            && typeof(item.name) === 'string'
                                            && typeof(item.price) === 'number'
                                            && item.id !== product
                                        ) {
                                            return item;
                                        } 
                                    });
                                }     
                            } else {
                                // Mark product as invalid
                                isProductInvalid = true;
                            }
                        }

                        // If the product isn't an invalid one save the basket
                        if(!isProductInvalid) {
                            userData.basket = basket;
                            _this._model.update(userData, function(err,data){
                                if(!err && data) {
                                    callback(false,data);
                                } else {
                                    callback(err);
                                }
                            });
                        } else {
                            callback({'code': 400, 'message': 'Bad request', 'data': {'param':'id', 'message': 'invalid'}});
                        }
                    } else {
                        callback(err);
                    }
                });
            } else {
                callback(err);
            }
        });
    }
}

/**
 * Module exports
 */
module.exports = BasketService;