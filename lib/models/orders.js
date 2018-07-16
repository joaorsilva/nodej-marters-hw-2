/**
 * Orders model class
 */

/**
 * Dependencies
 */

// Project
const driver = require('../drivers/filedata');
const helpers = require('../helpers');
const config = require('../../config/config');

class OrdersModel 
{
    /**
     * Class constructor
     * @param {object} data - Optional 
     */
    constructor(data) 
    {
        this._driver = driver;
        this._helpers = helpers;
        this._repo = "orders";
        this.id = "";
        this.date = "";
        this.name = "";
        this.email = "";
        this.address = "";
        this.products = [];
        this.taxes = config.otherExpenses.taxes;
        this.delivery = config.otherExpenses.delivery;
    
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
     * Reads one or more orders
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
     * Creates a new order
     * @param {object|null} data
     * @param {function} callback 
     */
    create(data, callback)
    {
    this.id = this._helpers.uuid();
        if(data) {
            data.id = this.id;
        }
        
        data = this._useProps(data);
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
     * Updates an existing order
     * @param {object|null} data 
     * @param {function} callback 
     */
    update(data, callback)
    {
        data = this._useProps(data);
        let _this = this;
        this._validate( function(err) {
        if(!err) {
            _this._driver.update(_this._repo, data.id, data, callback);
        } else {
            callback(err);
        }
        });
    }

    /**
     * Deletes a order
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
     * Assigns data to the order properties and 
     * returns the order properties as an object.
     * @param {object|null} data 
     */
    _useProps(data)
    {
        if(typeof(data) === 'object' && data) {
            this.id = data.id;
            this.name = data.name;
            this.email = data.email;
            this.date = data.date;
            this.address = data.address;
            this.products = data.products;
            this.taxes = data.taxes; // config.otherExpenses.taxes;
            this.delivery = data.delivery; //config.otherExpenses.delivery;
        }

        return {
            "id": this.id,
            "name": this.name,
            "email": this.email,
            "date": this.date,
            "address": this.address,
            "products": this.products,
            "taxes": this.taxes,
            "delivery": this.delivery
        };
    }

    /**
     * Validates the data to be inserted
     * @param {function} callback 
     */
    _validate(callback)
    {
        let valid = 
            typeof(this.id) === 'string' 
            && this.id.trim().length === 32 
            ? this.id.trim() 
            : false;
        if(valid === false) {
            callback({'code': 400, 'message': 'Bad request', 'data': {'field': 'id', 'message': 'invalid'}});
        } else {
            valid = 
                typeof(this.name) === 'string' 
                && this.name.trim().length >= 3 
                ? this.name.trim() 
                : false;
            if(valid === false) {
                callback({'code': 400, 'message': 'Bad request', 'data': {'field': 'name', 'message': 'invalid'}});
            } else {
                valid = 
                    typeof(this.email) === 'string'
                    && this._helpers.validateEmail(this.email) 
                    ? this.email 
                    : false;
                if(valid === false) {
                    callback({'code': 400, 'message': 'Bad request', 'data': {'field': 'email', 'message': 'invalid'}});
                } else {
                    valid = 
                        typeof(this.date) === 'number'
                        && this.date > 0 
                        ? this.date 
                        : false;
                    if(valid === false) {
                        callback({'code': 400, 'message': 'Bad request', 'data': {'field': 'date', 'message': 'invalid'}});
                    } else {
                        valid = 
                            typeof(this.address) === 'string'
                            && this.address.trim().length > 0 
                            ? this.address.trim()
                            : false;
                        if(valid === false) {
                            callback({'code': 400, 'message': 'Bad request', 'data': {'field': 'address', 'message': 'invalid'}});
                        } else {
                            valid = 
                                typeof(this.products) === 'object'
                                && this.products instanceof Array
                                && this.products.length > 0
                                && this._validateProducts(this.products)
                                ? this.products
                                : false;
                            if(valid === false) {
                                callback({'code': 400, 'message': 'Bad request', 'data': {'field': 'products', 'message': 'invalid'}});
                            } else {
                                callback(false);
                            }
                        }                    
                    }
                }
            }
        }
    }

    _validateProducts(products)
    {
        let valid = true;
        products.forEach(function(product){
            if(
                typeof(product.id) !== 'string'
                || product.id.trim().length !== 32
            ) {
                valid = false;
            }

            if(
                typeof(product.name) !== 'string'
                || product.name.trim().length === 0
            ) {
                valid = false;
            }

            if(
                typeof(product.price) !== 'number'
                || product.price <= 0
            ) {
                valid = false;
            }
            if(
                typeof(product.quantity) !== 'number'
                || product.quantity <= 0
            ) {
                valid = false;
            }
        });
        return valid;
    }
}

/**
 * Module exports
 */
module.exports = OrdersModel;