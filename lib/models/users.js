/**
 * Users model class
 */

/**
 * Dependencies
 */

 // Project
const driver = require('../drivers/filedata');
const helpers = require('../helpers');

class UsersModel 
{
    /**
     * Class constructor
     * @param {object} data - Optional 
     */
    constructor(data) 
    {
        this.types = ["admin","client"]
        this._driver = driver;
        this._helpers = helpers;
        this._repo = "users";
        this.id = "";
        this.name = "";
        this.email = "";
        this.address = "";
        this.type = "";
        this.password = "";
        this.orders = [];
        this.basket = [];

        if(data) 
        {
            this._useProps(data);
        }
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
     * Reads one or more users
     * @param {string} id - Optional
     * @param {function} callback 
     */
    read(id,callback)
    {
        this._driver.read(this._repo, id, function(err, data) {
            if(!err && data) {
                if(data === 'object' && !(data instanceof Array))
                {
                    this._useProps(data);
                    callback(false,this);
                } else {
                    callback(false,data);
                }
            } else {
                callback(err)
            }
        });
    }

    /**
     * Creates a new user
     * @param {object|null} data
     * @param {function} callback 
     */
    create(data, callback)
    {
        if(data) {
            this.id = data.email;
            data.id = this.id;
        }
        
        data = this._useProps(data);

        let _this = this;
        this._validate(function(err) {
            if(!err) {
                _this._driver.create(_this._repo, data.email, data,callback);
            } else {
                callback(err);
            }
        });
        
    }

    /**
     * Updates an existing user
     * @param {object|null} data 
     * @param {function} callback 
     */
    update(data, callback)
    {
        data = this._useProps(data);
        let _this = this;
        this._validate( function(err) {
            // We are updating other data than the email (id)
            if(!err) {
                _this._driver.update(_this._repo, data.email, data, callback);
            } else {
                callback(err);
            }
        });
    }

    /**
     * Deletes a user
     * @param {object|null} id 
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
        if(typeof(data) === 'object' && data) {
            this.id = data.id;
            this.type = data.type;
            this.name = data.name;
            this.email = data.email;
            this.password = data.password;
            this.address = data.address;
            if(typeof(data.basket) === 'object' && data.basket instanceof Array) {
                this.basket = data.basket;
            }
            if(typeof(data.orders) === 'object' && data.basket instanceof Array) {
                this.orders = data.orders;
            }
        }

        return {
            "id": this.id,
            "type": this.type,
            "name": this.name,
            "email": this.email,
            "password": this.password,
            "address": this.address,
            "orders": this.orders,
            "basket": this.basket
        };
    }

    /**
     * Validates the data to be inserted
     * @param {function} callback 
     */
    _validate(callback)
    {
        let valid = 
            typeof(this.name) === 'string' 
            && this.name.trim().length >= 3 
            ? this.name.trim() 
            : false;
        if(valid === false) {
            callback({'code': 400, 'message': 'Bad request', 'data': {'field': 'name', 'message': 'invalid'}});
        } else {
            valid = 
                typeof(this.type) === 'string',
                this.types.indexOf(this.type) > -1
                ? this.type
                :false;
            if (valid === false) {
                callback({'code': 400, 'message': 'Bad request', 'data': {'field': 'type', 'message': 'invalid'}});
            } else {
                valid = 
                    typeof(this.email) === 'string' 
                    && this.email.trim().length >= 3 
                    && this._helpers.validateEmail(this.email.trim()) 
                    ? this.email.trim() 
                    : false;
                if(valid === false) {
                    callback({'code': 400, 'message': 'Bad request', 'data': {'field': 'email', 'message': 'invalid'}});
                } else {
                    this.id = this.email;
                    valid = 
                        typeof(this.address) === 'string' 
                        && this.address.trim().length >= 3 
                        ? this.address.trim() 
                        : false;
                    if(valid === false) {
                        callback({'code': 400, 'message': 'Bad request', 'data': {'field': 'address', 'message': 'invalid'}});
                    } else {
                        valid = 
                            typeof(this.basket) === 'object' 
                            && this.basket instanceof Array 
                            ? this.basket 
                            : false;
                        if(valid === false) {
                            callback({'code': 400, 'message': 'Bad request', 'data': {'field': 'basket', 'message': 'invalid'}});
                        } else {
                            valid =
                                typeof(this.password) === 'string'
                                && this.password.trim().length > 6
                                ? this.password.trim()
                                : false;
                            if(valid === false) {
                                callback({'code': 400, 'message': 'Bad request', 'data': {'field': 'password', 'message': 'invalid'}});
                            } else {
                                callback(false);
                            }
                        }
                    }
                }
            }
        }        
    }
}

/**
 * Module exports
 */
module.exports = UsersModel;
