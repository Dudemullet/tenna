"use strict"
var fs = require('fs');
module.exports = function(app){
    var 
      deployDir = "./build",
      videoDir = '/wallpapers/',
      sysVideoDir = deployDir + videoDir,
      supportedFileFormats = app.get("fileExtensions") || ['mp4','png'];

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
          var
            fObjs = [],
            filteredFiles = files.filter(validExtensionsFilter);
          

          filteredFiles.forEach(function(val, i, arr){
            arr[i] = val;
            fObjs.push({
                name:val.substr(0,val.lastIndexOf(".")),
                path: videoDir+val
            });
          });

          callback({"files":fObjs});
        })
    }

    var validExtensionsFilter = function(index) {
        var fileNameExtension = index.substr(index.lastIndexOf(".")+1);
        return (supportedFileFormats[fileNameExtension] || false);
    }

    return { //module api
        "getFiles":getFiles,
        "getFilesAtDir":getFilesAtDir
    }
}