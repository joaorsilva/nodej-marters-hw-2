/**
 * Application entry point
 * 
 */


/**
 * Dependencies
 */

// Node

// Project
const server = require('./lib/server');
const filedata = require('./lib/drivers/filedata');

// Object container
const app = {};

/**
 * Initializes the application
 */
app.initialize = function () {

    // Ensures the existance of data containers
    app.check(function(err){
        if(!err) {
            // Initializes and starts the server
            server.initialize();
        } else {
            console.log('\x1b[31m%s\x1b[0m',`ERROR: ${err}`);
        }
    });
};

/**
 * Checks if all data containers exists or creates them
 * in case they don't exist
 */
app.check = function(callback)
{
    filedata.check('',function(err){
        if(!err) {
            filedata.check('users',function(err){
                if(!err) {
                    filedata.check('tokens',function(err){
                        if(!err) {
                            filedata.check('products',function(err){
                                if(!err) {
                                    filedata.check('orders',function(err){
                                        if(!err) {
                                            callback(false);
                                        } else {
                                            callback(err);
                                        }
                                    });                                            
                                } else {
                                    callback(err);
                                }
                            });                                            
                        } else {
                            callback(err);
                        }
                    });        
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
 * Calls application initialization
 */
app.initialize();

/**
 * Module exports
 */
module.exports = app;
