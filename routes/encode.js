"use strict";

var 
  handbrake = require("handbrake-js"),
  dirExp = require("node-dir"),
  util = require('util'),
  path = require("path"),
  fs = require("fs"),
  Encoder = require(__dirname + '/../lib/encoder'),
  EventEmitter = require('events').EventEmitter,
  _ = require('underscore');


module.exports = function(app, upload) {
  var // App level variables
    encodeDir = "./build/encode",
    videoDir = "./build/videos",
    uploadDir = "./build/uploads",
    encoder = new Encoder(),
    PATHSEP = path.sep,
    events = new EventEmitter(),
    movieExt = 'mp4';

    var startEncode = function(fileInfo) {
        console.log('start encode ', fileInfo);
        var inputName = uploadDir + '/' + fileInfo.name
        var encoding = encoder.encode(inputName, './build/encode')
            .on('error', function (err) {
                console.log('Error while encoding: ', err);
            })
            .on('progress', function (vid) {

            })
            .on('complete', function (vid) {
                var fileName = fileInfo.name;
                var lastDot = fileName.lastIndexOf('.');
                var withoutExt = (lastDot > 0) ? fileName.substr(0, lastDot) : fileName
                var endName = videoDir + "/" + withoutExt + '.' + movieExt;
                fs.rename(vid.output, endName, function(err) {
                    if (err) {
                        console.log('Error renameing ', err);
                        return;
                    }

                    fs.unlink(vid.input, function(err){
                        if (err) {
                            console.log('Error unlinking ', vid.input, err);
                            return;
                        }
                        events.emit('encodingComplete', encoding.vid);
                    });
                });
            });
        events.emit('encodingStart', encoding.vid);
    };

    upload.on('end', startEncode);

    app.get("/encode/status/:filename", function(req, res, next) {
        
        if(!req.params.filename) { // Either video was finished encoding or never existed
            res.send(400);
            return;
        }

        var filename = req.params.filename;

        if(!encoder.encodeStates.hasOwnProperty(filename)) {
            res.send(404);
        } else {
            res.json(encoder.encodeStates[filename].progress)
        }
    });

    app.get('/encode', function(req, res, next) {
        console.log("GET: encode");
        getProcessing(function(videoList) {
            res.render("encode",{"processing":videoList});
        });
    });

    app.get('/get/processing', function(req, res, next) {
        console.log("GET processing videos JSON list");
        getProcessing(function(videoList) {
            res.json(videoList)
        });
    });  

    /*
      Get a list of the videos currently being encoded
    */
    var getProcessing = function(cb) {
        var videoList = [];
        
        //Recursively get all files in dir
        dirExp.files(encodeDir, function(err,files) { 
            if(err) console.log(err);
            console.log("getProcessing: " + util.inspect(files));

            if(!files)
                return cb(videoList);

            //Per video, construct a useful video object
            files.forEach(function(val,i,arr){
                var 
                filename = val.substr(val.lastIndexOf(PATHSEP)+1),
                name = filename.substr(0,filename.lastIndexOf("."));
                videoList.push({
                    "name": name,
                    "filename": filename
                });
            });
            
            console.log("videoList: \n\t" + util.inspect(videoList));
            
            return cb(videoList);
        });
    };

    return {
        getProcessing: getProcessing,
        events: events
    };
};
