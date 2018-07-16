/**
 * HTTP Server object
 * This module implements the HTTP server functiononality.
 */

/**
 * Dependencies
 */

 // Node
const http = require('http');
const url = require('url');
const config = require('../config/config');
const StringDecoder = require('string_decoder').StringDecoder;

// Project
const helpers = require('./helpers');
const router = require('./router');

// Object container
const server = {};

server.config = {};

/**
 * Create the server HTTP object instance
 */
server.http = http.createServer(function(req,res) 
{
    server.routeUrl(req,res)
});

/**
 * Server initializtion
 */
server.initialize = function() 
{
    let port = config.server.port;

    server.http.listen(port, function() 
    {
        console.log('\x1b[32m%s\x1b[0m',`Server listenning on port ${port}`);
    });
}

/**
 * Calls the apropriate API endpoint 
 */
server.routeUrl = function(req,res) 
{
    //Initializes the user's request object
    const request = {
        route: "",
        query: "",
        method: "",
        headers: [],
        token: "",
        user: "",
        data: {}
    };

    // Parses the URL
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const normalizedPath = path.replace(/^\/+|\/+$/g,'');

    // Assigns the parsed URL values to each correspondent request variable. 
    request.route = typeof(normalizedPath) === 'string' ? normalizedPath.toLowerCase() : '';
    request.query = parsedUrl.query;
    request.method =req.method.toLowerCase();
    request.headers = req.headers;

    // Decodes any request payload data as UTF-8
    const decoder = new StringDecoder('utf-8');
    // Request data payload buffer
    let payloadBuffer = '';

    // Stores partially received data into the request payload buffer.
    req.on('data', function(data)
    {
        payloadBuffer+=decoder.write(data);
    });

    // When the payload data reaches it's end, store, parse, and assign it.
    req.on('end', function() 
    {
        payloadBuffer += decoder.end();
        
        request.data = helpers.parseJsonToObject(payloadBuffer);

        // Calls the router enroute method and prepares the returned data to be sent to the client.
        router.enroute(request, function(err, payload) 
        {
            //Sets the content type to JSON
            res.setHeader('Content-Type','application/json');
            console.log('Returned err: ', err, 'Returned payload',payload);
            if(typeof(err) === 'object') {
                statusCode = err.code;
                payload = err;
            } else if(typeof(payload) === 'object' && typeof(payload.code) === 'number') {
                statusCode = payload.code;
                payload = payload.data;
            } else {
                statusCode = 200;
            }

            // Stringify payload object
            payload = typeof(payload) === 'object' ? JSON.stringify(payload) : JSON.stringify({});

            // Assigns the response status code
            res.writeHead(statusCode);

            // Sends the response content (if any)
            res.end(payload);
        });
    });
}

/**
 * Module exports
 */
module.exports = server;

