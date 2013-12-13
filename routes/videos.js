"use strict";
var fs = require('fs');

module.exports = function(app) {
    var deployDir = "./build";
    var videoDir = '/videos/';
    var sysVideoDir = deployDir + videoDir;

    app.get('/videos', function(req, res, next){
        getMovies(function(files){
            res.render("videos",files);
        })
    });
    app.get('/get/videos', function(req, res, next){

        getMovies(function(x1){
            res.send(x1);
        });
    });

    var getMoviesAtDir = function(dir,fn){
        fs.readdir(dir, function(err, files) { if(err) throw err;
            var videosObj = {"videos":[]};

            files = files.filter(function(index){
                return index.substr(index.lastIndexOf(".")+1) === "mp4";
            })

            files.forEach(function(val, i, arr){
                var filename = val;
                var path = videoDir + val;
                videosObj.videos.push({
                    "fileName":filename,
                    "path":path,
                    "name": filename.substr(0,filename.lastIndexOf(".")),
                    "sub":videoDir + filename.substr(0,filename.lastIndexOf(".")) + ".vtt"
                });
            });

            fn(videosObj);
        });
    };
    var getMovies = function(fn){
        return getMoviesAtDir(sysVideoDir,fn);
    };

    return { //module API
        "getMoviesAtDir":getMoviesAtDir,
        "getMovies":getMovies
    };
}