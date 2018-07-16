/**
 * Tokens model class
 */

/**
 * Dependencies
 */

// Project
const driver = require('../drivers/filedata');
const helpers = require('../helpers');

class TokensModel
{
    /**
     * Class constructor
     * @param {object} data - Optional 
     */
    constructor() 
    {
        this._driver = driver;
        this._helpers = helpers;
        this._repo = "tokens";
        this.id = "";
        this.user = "";
        this.expires = 0;
    }

    /**
     * Checks if the data repository (file, table, etc) exists
     * @param {function} callback 
     */
    check(callback)
    {
        this._driver.check(this._repo, function(err) {
            if(!err)
            {
                callback(false);
            } else {
                callback(err);
            }
        });
    }

    /**
     * Reads one or more tokens
     * @param {string} id - Optional
     * @param {function} callback 
     */
    read(id,callback)
    {
        let _this = this;
        this._driver.read(this._repo, id, function(err, data) {
            if(!err && data) {
                if(data === 'object' && !(data instanceof Array))
                {
                    _this._useProps(data);
                    callback(false,_this);
                } else {
                    callback(false,data);
                }
            } else {
                callback(err)
            }
        });
    }

    /**
     * Creates a new token
     * @param {function} callback 
     */
    create(user,callback)
    {
        this.id = this._helpers.uuid();
        this.expires = Date.now() + 3600*1000;
        this.user = user;
        const data = this._useProps();
        let _this = this;
        this._validate( function(err) {
            if(!err) {
                _this._driver.create(_this._repo, data.id, data, callback);
            } else {
                callback(err);
            }
        });
    }

    /**
     * Updates an existing token
     * @param {function} callback 
     */
    update(id,callback)
    {
        if(typeof(id) === 'string') {
            this.id = id;
        }        
        let _this = this;
        
        this.read(id,function(err,data) {
            if(!err && data) {
                _this.expires = Date.now() + 3600*1000;
                data = _this._useProps(data);
                _this._validate( function(err) {
                    if(!err) {
                        _this._driver.update(_this._repo, data.id, data, callback);
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
     * Deletes a token
     * @param {string|null} id 
     * @param {function} callback 
     */
    delete(id,callback)
    {
        if(typeof(id) === 'string') {
            this.id = id;
        }
        this._driver.delete(this._repo, this.id, callback);
    }

    /**
     * Assigns data to the user properties and 
     * returns the user properties as an object.
     * @param {object|null} data 
     */
    _useProps(data)
    {
        if(typeof(data) === 'object') {
            this.id = data.id,
            this.user = data.user,
            this.expires = data.expires
        }

        return {
            "id": this.id,
            "user": this.user,
            "expires": this.expires
        };
    }

    /**
     * Validates the data to be inserted
     * @param {function} callback 
     */
    _validate(callback)
    {
        let valid =
            typeof(this.user) === 'string'
            && this.user.trim().length
            && this._helpers.validateEmail(this.user)
            ? this.user.trim()
            : false;
        if(valid === false) {
            callback({'code':400,'message': 'Bad request', 'data': {'field':'user','message':'invalid'}});
        } else {
            callback(false);
        }
        
    }
}
/**
 * Module exports
 */
module.exports = TokensModel;
 