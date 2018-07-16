/**
 * Products model class
 */

/**
 * Dependencies
 */

// Project
const driver = require('../drivers/filedata');
const helpers = require('../helpers');

class ProductsModel 
{
    /**
     * Class constructor
     * @param {object} data - Optional 
     */
    constructor(data) 
    {
        this._driver = driver;
        this._helpers = helpers;
        this._repo = "products";
        this.id = "";
        this.name = "";
        this.description = "";
        this.price = 0;

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
     * Reads one or more products
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
     * Creates a new product
     * @param {object|null} data
     * @param {function} callback 
     */
    create(data, callback)
    {
        this.id = this._helpers.uuid();
        data.id = this.id;
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
     * Updates an existing product
     * @param {object|null} data 
     * @param {function} callback 
     */
    update(id,data, callback)
    {
        if(typeof(id) === 'string') {
            this.id = id;
            data.id = this.id;
        }
        data = this._useProps(data);
        let _this = this;
        this._validate( function(err) {
            if(!err) {
                _this._driver.update(_this._repo, id, data, callback);
            } else {
                
                callback(err);
            }
        });
    }

    /**
     * Deletes a product
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
     * Assigns data to the product properties and 
     * returns the product properties as an object.
     * @param {object|null} data 
     */
    _useProps(data)
    {
        if(typeof(data) === 'object' && data) {
            this.id = data.id;
            this.name = data.name;
            this.description = data.description;
            this.price = data.price;
        }

        return {
            "id": this.id,
            "name": this.name,
            "description": this.description,
            "price": this.price,
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
                    typeof(this.price) === 'number'
                    && this.price >= 0 
                    ? this.price 
                    : false;
                if(valid === false) {
                    callback({'code': 400, 'message': 'Bad request', 'data': {'field': 'price', 'message': 'invalid'}});
                } else {
                    callback(false);
                }
            }
        }
    }
}
 
 /**
  * Module exports
  */
 module.exports = ProductsModel;