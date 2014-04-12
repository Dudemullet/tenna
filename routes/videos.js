"use strict";

var fs = require('fs'),
    escape = require('escape-html'),
    dirExp = require("node-dir"),
    express = require("express"),
    path = require("path");

module.exports = function(app) {
    var 
        movieDir = app.get("movieDir"),
        encodeDir = app.get("encodeDir"),
        dirCollection = {},
        PATHSEP = path.sep,
        subExt = "vtt";
        
    app.use( "/videos", express.static("./build/videos"));

    /*
        Routes
    */
    app.get('/videos', function(req, res, next) {
        getMovies(function(videoList){
            res.render("videos",{
                "videos": videoList
            });
        });
    });

    app.get('/get/videos', function(req, res, next) {
        getMovies(function(videoList){
            res.json(videoList)
        });
    });

    var getMovies = function(cb) {
        var videoList = [];

        //Recursively get all files in dir
        dirExp.files(movieDir, function(err,files) { if(err) console.log(err);
            if(!files)
                return cb(videoList);

            // Get supported files with valid extensions (mp4, avi, etc...)
            var filteredVideos = files.filter(validExtensionsFilter);

            //Per video, construct a useful video object
            filteredVideos.forEach(function(val,i,arr){
                videoList.push(newVideo(val, movieDir));
            });
            
            cb(videoList);
        });
    }

    var validExtensionsFilter = function(index) {
        var fileNameExtension = index.substr(index.lastIndexOf(".")+1);
        return fileNameExtension != subExt;
    }

    var newVideo = function(val, staticDir) {
        var filename = val.substr(val.lastIndexOf(PATHSEP)+1);
        var folderKey = val.substr(0,val.lastIndexOf(PATHSEP));
        
        var strLen = staticDir.length;
        var staticDirPath = val.substr(val.indexOf(staticDir)+strLen);
        staticDir = staticDir.replace(/ /g,'-')
                    .replace(/[^\w-]+/g,'');
        return {
            "stat": "/videos/" + filename,
            "dir": folderKey,
            "fileName": filename, //includes extension
            "path": escape(val),
            "name": filename.substr(0,filename.lastIndexOf(".")),
            "vttSub": "/videos/" + filename.substr(0,filename.lastIndexOf(".")) + "." + subExt
        };
    }

    return {
        "getMovies":getMovies
    }
}