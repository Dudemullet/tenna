"use strict"
var fs = require('fs');
module.exports = function(app){
    var deployDir = "./build";
    var videoDir = '/wallpapers/';
    var sysVideoDir = deployDir + videoDir;

    app.get('/files', function(req, res, next){
        getFiles(function(files) {
            res.render("files",files);
        });
    });
    app.get('/get/files', function(req, res, next){
        getFiles(function(files) {
            res.send(files);
        });
    });

    var getFiles = function(callback) {
        return getFilesAtDir(sysVideoDir,callback);
    }

    var getFilesAtDir = function(dir, callback) {
        fs.readdir(dir, function(err,files) { if(err) throw err;
            var fObjs = [];
            files.forEach(function(val, i, arr){
                arr[i] = val;
                fObjs.push({
                    name:val.substr(0,val.lastIndexOf(".")),
                    path: videoDir+val
                });
            });

            files = {"files":fObjs};
            callback(files);
        })
    }

    return { //module api
        "getFiles":getFiles,
        "getFilesAtDir":getFilesAtDir
    }
}