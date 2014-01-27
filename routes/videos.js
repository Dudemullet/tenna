"use strict";
var fs = require('fs');
var escape = require('escape-html');
var dirExp = require("node-dir");
var express = require("express");
var path = require("path");

module.exports = function(app) {
    var 
        watchedDirs = ["./build/videos"],
        dirCollection = {},
        videoList = [],
        supportedFileFormats = app.get("fileExtensions") || "mp4",
        PATHSEP = path.sep;
        
    var setStaticDirs = function() {
        watchedDirs.forEach(function(dir){
            var parentDir = dir.substr(dir.lastIndexOf(PATHSEP));
            parentDir = parentDir.replace(/ /g,'-')
                        .replace(/[^\w-]+/g,'');

            app.use( PATHSEP +parentDir,express.static(dir));
        });
    }
    setStaticDirs();

    /*
        Routes
    */
    app.get('/videos', function(req, res, next){

        if(videoList.length <= 0){

            getMoviesInWatchedDirs(function(err){
                res.render("videos",{"videos":videoList});
            });
        }

        res.render("videos",{"videos":videoList});
    });

    app.get('/get/videos', function(req, res, next){
        if(!dirCollection){
            getMoviesInWatchedDirs();
        }
        res.json(dirCollection);
    });

    /*
        Methods
    */
    var getMoviesInWatchedDirs = function(cb) {
        watchedDirs.forEach(function(dir){

            var staticDir = dir.substr(dir.lastIndexOf(PATHSEP));

            dirExp.files(dir,function(err,files){ if(err) console.log(err);
                // Get files with supported file formats
                var filteredVideos = files.filter(function(index){
                    var fileNameExtension = index.substr(index.lastIndexOf(".")+1);
                    return (supportedFileFormats[fileNameExtension] || false);
                });

                //Per video, construct a useful video object
                filteredVideos.forEach(function(val,i,arr){
                    var newVid = newVideo(val, staticDir);
                    // console.log("VIDEO: " + newVid);
                    addVideoToCollection(newVid);
                });
            });
        })
    }

    var addVideoToCollection = function(videoObj) {
        dirCollection[videoObj.dir] = dirCollection[videoObj.dir] || [];
        dirCollection[videoObj.dir].push(videoObj);
        videoList.push(videoObj);
    }

    var getMovies = function(cb) {
        return cb(videoList);
    }
    var getMovieDirs = function(cb) {
        return cb(dirCollection);
    }

    var newVideo = function(val, staticDir) {
        var filename = val.substr(val.lastIndexOf(PATHSEP)+1);
        var folderKey = val.substr(0,val.lastIndexOf(PATHSEP));
        
        var strLen = staticDir.length;
        var staticDirPath = val.substr(val.indexOf(staticDir)+strLen);
        staticDir = staticDir.replace(/ /g,'-')
                    .replace(/[^\w-]+/g,'');
        return {
            "stat": "/" + staticDir + staticDirPath,
            "dir": folderKey,
            "parentDir":folderKey.substr(folderKey.lastIndexOf(PATHSEP)),
            "fileName": filename, //includes extension
            "path": escape(val),
            "name": filename.substr(0,filename.lastIndexOf(".")), // No extension ie .mp4
            "vttSub": folderKey + filename.substr(0,filename.lastIndexOf(".")) + ".vtt",
            "srtSub": folderKey + filename.substr(0,filename.lastIndexOf(".")) + ".srt"
        };
    }

    return {
        "getMovies":getMovies,
        "getMovieDirs":getMovieDirs
    }
}