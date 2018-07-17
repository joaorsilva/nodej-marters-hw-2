/**
 * Tokens service class (logic implementation)
 */

/**
 * Dependencies
 */

// Node

// Project
const TokensModel = require('../models/tokens');
const UsersModel = require('../models/users');
const helpers = require('../helpers');

class TokensService 
{
    constructor()
    {
        this._model = new TokensModel();
        this._usersModel = new UsersModel();
    }
    /**
     * Reads one or more tokens
     * Require Token: Yes
     * 
     * @param {string} id - Token string
     * @param {function} callback - Callback function (err,data)
     */
    read(id, callback) 
    {
        let _this = this;
        this.valid(id, function(err,data) {
            if(!err && data) {
                _this._model.read(id,data,callback);
            } else {
                callback(err);
            }
        });
    }

    /**
     * Creates a new tokens
     * Require Token: No
     * 
     * @param {object} data - User credentials object {username, password}
     * @param {function} callback - Callback function (err,data) 
     */
    create(data, callback) 
    {
        if(data) {
            data.username = 
                typeof(data.username) === 'string'
                && data.username.trim().length > 0
                ? data.username.trim() 
                : false;
            data.password = 
                typeof(data.password) === 'string'
                && data.password.trim().length > 0
                ? data.password.trim() 
                : "asd";
            if(data.username && data.password) 
            {
                let _this = this;
                _this._usersModel.read(data.username, function(err,userData) {
                    if(!err && data) {
                        if(userData.password === helpers.hash(data.password)) {
                            _this._model.create(userData.email,function(err,data) {
                                if(!err && data) {
                                    callback(false,data);
                                } else {
                                    callback(err,data);
                                }
                            });    
                        } else {
                            callback({'code': 401, 'message': 'Unauthorized', 'data': {'field': 'password','message': 'invalid'}})
                        }
                    } else {
                        callback(err);
                    }
                });
            } else {
                callback({'code': 401, 'message': 'Unauthorized', 'data': {'field': 'username or password','message': 'invalid'}})
            }        
        } else {
            callback({"code": 400, "message": "Bad request", "data": {"field":null,"message":"No JSON data"}})
        }
    }

    /**
     * Updates an tokens (refreshes it and extends for more 1h)
     * Require Token: Yes
     * 
     * @param {string} id - Token string 
     * @param {function} callback - Callback function (err,data)
     */
    update(id, callback) 
    {
        if(id) {
            this._model.update(id,function(err,data) {
                callback(err,data);
            });
        } else {
            callback({"code": 400, "message":"Bad request", "data": {"param": "token", "message": "invalid"}});
        }
    }

    /**
     * Deletes an tokens
     * Require Token: Yes
     * 
     * @param {number} id - Token string 
     * @param {function} callback - Callback function (err,data)
     */
    delete(id, callback) 
    {
        if(id) {
            this._model.delete(id,function(err){
                callback(err); 
            });
        } else {
            callback({"code": 400, "message":"Bad request", "data": {"param": "id", "message": "invalid"}});
        }
    }

    /**
     * Checks if a token is valid and returns the token data
     * @param {string} id - Token string
     * @param {function} callback - Callback function (err,data)
     */
    valid(id,callback)
    {
        let _this = this;
        this._model.read(id, function(err,tokenData) {
            if(!err && tokenData) {
                if(tokenData.expires > Date.now()) {
                    _this.update(id, function(err,data) {
                        if(!err && data) {
                            
                            callback(false,tokenData);
                        } else {
                            callback(err);
                        }
                    });
                } else {
                    callback({'code': 401, 'message': 'Unauthorized', 'data':{'field': 'expire','message':'token expired'}});
                }
            } else {
                callback(err);
            }
        });
    }
}

/**
 * Module exports
 */
module.exports = TokensService;