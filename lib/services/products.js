/**
 * Products service class (logic implementation)
 */

/**
 * Dependencies
 */

// Node

// Project
const ProductsModel = require('../models/products');
const UsersModel = require('../models/users');
const TokensService = require('./tokens');

class ProductsService {

    constructor()
    {
        this._model = new ProductsModel();
        this._usersModel = new UsersModel();
        this._tokenService = new TokensService();
    }

    /**
     * Reads one or more products if a product id isn't passed
     * Require Token: No
     * 
     * @param {string} id - Product to read (Optional)
     * @param {function} callback - Callback function (err,data)  
     */
    read(id,callback) 
    {
        this._model.read(id,callback);
    }

    /**
     * Creates a new product
     * Require Token: Yes
     * 
     * @param {object} data - Product object {name, description, price}
     * @param {string} token - Token string 
     * @param {function} callback - Callback function (err,data)  
     */
    create(data,token,callback) 
    {
        let _this = this;
        this._tokenService.valid(token,function(err,tokenData) {
            if(!err && tokenData) {
                _this._usersModel.read(tokenData.user,function(err,userData) {
                    if(!err && userData) {
                        if(userData.type === 'admin') {
                            // TODO: Create product in stripe
                            _this._model.create(data,callback);
                        } else {
                            callback({'code': 403, 'message': 'Forbidden', 'data':{'field':'type', 'message': 'Only admin type users are able to administer products.'}});
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
     * Updates a products
     * Require Token: Yes
     * 
     * @param {string} id - Product id to be updated 
     * @param {object} data- Product object {name, description, price} 
     * @param {string} token - Token string 
     * @param {function} callback - Callback function (err,data)  
     */
    update(id,data,token,callback) 
    {
        let _this = this;
        if(id) {
            this._tokenService.valid(token,function(err,tokenData) {
                if(!err && tokenData) {
                    _this._usersModel.read(tokenData.user,function(err,userData) {
                        if(!err && userData) {
                            if(userData.type === 'admin') {
                                // TODO: Update product in stripe
                                _this._model.update(id,data,callback);
                            } else {
                                callback({'code': 403, 'message': 'Forbidden', 'data':{'field':'type', 'message': 'Only admin type users are able to administer products.'}});
                            }
                        } else {
                            callback(err);
                        }
                    });    
                } else {
                    callback(err);
                }
            });
        } else {
            callback({"code": 400, "data": {"param": "id", "message": "invalid"}});
        }
    }

    /**
     * Deletes a product
     * Require Token: Yes
     * 
     * @param {string} id - Product id to be deleted 
     * @param {function} callback - Callback function (err,data)  
     */
    delete(id,token,callback) 
    {
        let _this = this;
        if(id) {
            this._tokenService.valid(token,function(err,tokenData) {
                if(!err && tokenData) {
                    _this._usersModel.read(tokenData.user,function(err,userData) {
                        if(!err && userData) {
                            if(userData.type === 'admin') {
                                // TODO: Remove product from stripe
                                this._model.delete(id,callback);
                            } else {
                                callback({'code': 403, 'message': 'Forbidden', 'data':{'field':'type', 'message': 'Only admin type users are able to administer products.'}});
                            }
                        } else {
                            callback(err);
                        }
                    });    
                } else {
                    callback(err);
                }
            });
        } else {
            callback({"code": 400, "data": {"param": "id", "message": "invalid"}});
        }
    }
}

/**
 * Module exports
 */
module.exports = ProductsService;


