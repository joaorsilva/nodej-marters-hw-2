/**
 * Users service class (logic implementation)
 */

/**
 * Dependencies
 */

// Node

// Project
const UsersModel = require('../models/users');
const TokensService = require('./tokens');
const helpers = require('../helpers');

class UsersService {

    constructor() 
    {
        this._model = new UsersModel()
        this._tokens = new TokensService()
    }

    /**
     * Reads one or more users
     * Require Token: Yes
     * 
     * @param {string} token - Token string
     * @param {function} callback - Callback function (err,data)
     */
    read(token,callback) 
    {
        let _this = this;
        this._tokens.valid(token,function(err,tokenData) {
            if(!err && tokenData) {
                _this._model.read(tokenData.user,function(err,data) {
                    if(!err && data) {
                        data.password = "";
                        callback(false,data);
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
     * Creates a new users
     * Require Token: No
     * 
     * @param {object} data - User object {type,name,email,address}
     * @param {function} callback - Callback function (err,data)
     */
    create(data,token,callback) 
    {
        let _this = this;
        if(data) {
            data.password = 
                typeof(data.password) === 'string' 
                && data.password.trim().length >= 6
                ? helpers.hash(data.password.trim())
                : false;
            
            if(data.password === false) 
            {
                callback({'code': '400', 'message': 'Bad request', 'data': {'field': 'password', 'message': 'invalid'}});
            } else {        
                if(data.type === 'admin') {
                    this._tokens.valid(token,function(err,tokenData) {
                        if(!err && tokenData) {
                            _this._model.read(tokenData.user, function(err, userData) 
                            {
                                if(!err && userData) 
                                {
                                    if(userData.type === 'admin') {
                                        _this._model.create(data,callback);
                                    } else {
                                        callback({'code': 401, 'message': 'Unauthorized', 'data': {'field': 'type', 'message': 'Only admin users can create other admin users'}});
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
                    data.type = 'client';
                    this._model.create(data,callback);
                }
            }
        } else {
            callback({"code": 400, "message": "Bad request", "data": {"field":null,"message":"No JSON data"}});
        }
    }

    /**
     * Updates an users
     * Require Token: Yes
     * 
     * @param {object} data - User object {type,name,email,address}
     * @param {string} token - Token string
     * @param {function} callback - Callback function (err,data) 
     */
    update(data, token, callback) 
    {
        let _this = this;
        
        this._tokens.valid(token,function(err,tokenData) {
            if(!err && tokenData) {
                _this._model.read(tokenData.user, function(err, userData) {
                    
                    if(!err && userData) {
                        if(data.type === 'admin' && userData.type !== 'admin') {
                            callback({"code": 401, "message": 'Unauthorized' ,"data": {"field": "type", "message": "Only admin users can set user type to admin"}});
                        } else {
                            data.password = 
                                typeof(data.password) === 'string' 
                                && data.password.trim().length > 6
                                ? helpers.hash(data.password.trim())
                                : false;
                            if(data.password === false) {
                                data.password = userData.password;
                            }
                            // Email never changegs and it is the user id
                            data.email = userData.email;
                            console.log('User Update: ', data);
                            _this._model.update(data,callback);
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
     * Deletes an users
     * Require Token: Yes
     * 
     * @param {string} token - Token string 
     * @param {function} callback - Callback function (err,data) 
     */
    delete(token, callback)
    {
        let _this = this;
        this._tokens.valid(token,function(err,tokenData) {
            if(!err && tokenData) {
                if(tokenData.user) {
                    _this._model.delete(tokenData.user,function(err,data) {
                        if(!err && data) {
                            callback(false,data);
                        } else {
                            callback(err);
                        }
                    });
                } else {
                    callback(err);
                }
            }
        });
    }
}

/**
 * Module exports
 */
module.exports = UsersService;


