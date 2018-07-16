/**
 * Config functions
 * 
 */

/**
 * Dependencies
 */

// Node
const fs = require('fs');
const path = require('path');

// Project

const config = {
    "production": {
        "server": {
            "port": 5000
        },
        "directories": {
            "data": ".data",
            "logs": ".logs"
        },
        "apis": {
            "stripe": {
                "privKey": "",
                "pubKey": ""
            },
            "mailgun": {
            }
        },
        "datadriver": "filedata",
        "secret": "&45f!JDfE26*2"
    },
    "staging": {
        "server": {
            "port": 3000
        },
        "directories": {
            "data": ".data",
            "logs": ".logs"
        },
        "apis": {
            "stripe": {
                "privKey": "",
                "pubKey": ""
            },
            "mailgun": {
                "auth": "",
                "account": "",
                "user": "postmaster"
            }
        },
        "datadriver": "filedata",
        "secret": "123456",
        "otherExpenses": {
            "taxes": 9.3,
            "delivery": 15.00
        }
    }
};

const currEnv = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging';

const exportEnv = typeof(config[currEnv]) === 'object' ? config[currEnv] : config.staging;

module.exports = exportEnv;