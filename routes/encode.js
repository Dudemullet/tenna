"use strict";
var 
  handbrake = require("handbrake-js"),
  child_process = require("child_process"),
  util = require('util');

module.exports = function(app, upload){

  var 
    movieDir = app.get("movieDir"),
    encodeDir = app.get("encodeDir"),
    fileEncodeOptions = {
      encoder: "x264",
      "keep-display-aspect":true,
      modulus:16,
      vb:"2500",
      quality:"20",
      "crop":"0:0:0:0"
    },
    movieExts = app.get("movieExtensions") || ["mp4"],
    encodeQueue = {};

  upload.on("end",function(fileInfo) {
    var 
      filename = fileInfo.name,
      fileExt = filename.substr(filename.lastIndexOf(".")+1);

    if(!movieExts[fileExt]) {
      console.info("Unsupported file upload: %s", filename); //Delete ?
      return;
    }
    
    fileInfo.nameNoExt = filename.substr(0,filename.lastIndexOf("."));
    fileInfo.fileOut = encodeDir + '/' + fileInfo.nameNoExt + '.mp4';

    encodeUploadedMovie(fileInfo);
  });

  var encodeUploadedMovie = function(fileInfo) {
    var
      fm = upload.fileManager({ //TODO filemanager is being shared betwen this and upload.js that why we re-set it
        uploadDir: function() {
          return encodeDir;
        }
      });

    fileEncodeOptions.input = encodeDir + '/' + fileInfo.name;
    fileEncodeOptions.output = fileInfo.fileOut;
    encodeQueue[fileInfo.name] = {};

    //DEBUG
    console.log("Adding file to encode QUEUE: %s", fileInfo.name);

    var handle = handbrake.spawn(fileEncodeOptions)
    .on("complete", function(params){ 
      console.log("FINISH encoding for: \n\t%s", fileInfo.nameNoExt);
      fm.move(fileInfo.fileOut, "../videos", function(err){ 
          if(err)
              console.log(err);
      });
      delete encodeQueue[fileInfo.name];
    });

    setupEndpoint(handle, fileInfo.name);
  }

  var setupEndpoint = function(handle, filename) {
    handle.on("error", function(err){
        console.log(err.message);
        delete encodeQueue[filename];
    })
    .on("output", console.log)
    .on("progress", function(progress){

      //DEBUG
      console.log("PROGRESS - endpoint: %s", filename);

      encodeQueue[filename].eta = progress.eta;
      encodeQueue[filename].complete = progress.percentComplete;
    });
  }

  //DEBUG 
  app.use("/test", function(req, res, next){
    var 
      fileInfo = {
        "name": 'souls.avi',
        "fileOut": './lol.mp4',
        "nameNoExt": 'souls',
        "dir": './'
      };

    encodeUploadedMovie(fileInfo);
    res.send(200);
  });

  app.get("/encode/status/:filename", function(req, res, next) {
    /*  DEBUG
    // console.log("GET endpoint for: %s", req.params.filename);
    // encodeQueue["rofl"] = {
    //   "complete" : (function(){return Math.random(0,1) * 100;})(),
    //   "eta": "01h02m03s"
    // }; */
    console.log("Available props: \n" + util.inspect(encodeQueue));

    var filename = req.params.filename;

    if(!encodeQueue[req.params.filename]) {
      res.send(400);
    } else {
      res.json(encodeQueue[filename])
    }
  });

}