/**
 * File based database
 * Data abstraction driver
 */

 /**
 * Dependencies
 */

// Node
const fs = require('fs');
const config = require('../../config/config');
const path = require('path');

// Project
const helpers = require('../helpers');

// Object container
const fileData = {};

// Base data directory
fileData.baseDir = path.join(__dirname,'/../../' + config.directories.data);

fileData.check = function(source,callback)
{
    const dirName = fileData.baseDir+'/'+source;
    fs.realpath(dirName,'utf-8', function(err,path)
    {
        if(!err) 
        {
            console.log(`Data directory '${path}' is Ok!`)
            callback(false);
        } else {
            fs.mkdir(dirName,'755',function(err) {
                if(!err) {
                    console.log(`Data directory '${path}' was created and is Ok!`)
                    callback(false);
                } else {
                    console.log(err);
                    callback(`Failed to create data directory [${dirName}]`);
                }
            });
        }
    });
}

fileData.read = function(source, id, callback) 
{
    if(id)
    {
        fileData._readOne(source, id, callback);
    } else {
        fileData._readMany(source,callback);
    }
}

fileData.create = function(source, id, data,callback) 
{
    fs.open(fileData.baseDir+'/'+source+'/'+id+'.json','wx', function(err,fileDescriptor) 
    {
        if(!err && fileDescriptor)
        {
            let stringData = JSON.stringify(data);
            fs.writeFile(fileDescriptor, stringData, function(err) 
            {
                if(!err) 
                {
                    fs.close(fileDescriptor, function(err) 
                    {
                        if(!err) 
                        {
                            callback(false,{"code":201, "data": {"id":id}});
                        } else {
                            callback({
                                "code": 500,
                                "message": "error closing resource file" 
                            });
                        }
                    });
                } else {
                    callback({
                        "code": 500,
                        "message": "error writing resource" 
                    });
                }
            });
        } else {
            callback({
                "code": 409, 
                "message": "resource already exists"
            });
        }
    });
}

fileData.update = function(source, id, data, callback) 
{
    fs.open(fileData.baseDir+'/'+source+'/'+id+'.json','r+', function(err,fileDescriptor) 
    {
        if(!err && fileDescriptor) 
        {
            let stringData = JSON.stringify(data);
            fs.ftruncate(fileDescriptor, function(err) {
                if(!err) 
                {
                    fs.writeFile(fileDescriptor, stringData, function(err) 
                    {
                        if(!err) 
                        {
                            fs.close(fileDescriptor, function(err) 
                            {
                                if(!err) 
                                {
                                    callback(false,{"code":200});
                                } else {
                                    callback({
                                        "code": 500,
                                        "message": "error closing resource file"
                                    });
                                }
                            });
                        } else {
                            callback({
                                "code": 500, 
                                "message": "error writing resource"
                            });        
                        }
                    });          
                } else {
                    callback({
                        "code": 500, 
                        "message": "error deleting resource old data"
                    });
                }
            });
        } else {
            callback({
                "code": 404, 
                "message": "resource not found"
            });
        }
    });
}

fileData.delete = function(source, id, callback) 
{
    fs.unlink(fileData.baseDir+'/'+source+'/'+id+'.json', function(err) {
        if(!err) 
        {
            callback(false,{code:200});
        } else {
            callback({
                "code": 404, 
                "message": "error deleting resource or resource not found"
            });
        }
    });
}

fileData.exists = function(source,id, callback)
{
    fs.access(fileData.baseDir+'/'+source+'/'+id+'.json', fs.constants.R_OK, (err) => {
        callback(err);
    });   
}

fileData._readOne = function(source,id, callback)
{
    fs.readFile(fileData.baseDir+'/'+source+'/'+id+'.json','utf-8', function(err,data) 
    {
        if(!err && data) 
        {
            let document = helpers.parseJsonToObject(data);
            callback(false,document);
        } else {
            callback({          
                "code": 404, 
                "message": "resource not found"
            });
        }
    });
}

fileData._readMany = function(source, callback)
{
    console.log(fileData.baseDir+'/'+source+'/');
    fs.readdir(fileData.baseDir+'/'+source+'/', function(err,data) 
    {
        if(!err && data && data.length >= 0) 
        {
            const files = [];
            const fileCount = data.length;
            let currFile = 0;
            if(data.length > 0) {
                data.forEach(function(name)
                {
                    let fName = name.replace('.json','');
                    fileData._readOne(source,fName, function(err,data) 
                    {
                        if(!err && data) 
                        {
                            files.push(data);
                            currFile++;
                            if(currFile === fileCount) 
                            {
                                callback(false,files);
                            }
                        } else {
                            callback(err);
                        }
                    });
                });
            } else {
                callback(false,[]);
            }
        } else {
            callback({          
                "code": 500, 
                "message": "error reading directory"
            });
        }
    });
}

/**
 * Module exports
 */
module.exports = fileData;
