"use strict";
var 
  handbrake = require("handbrake-js"),
  child_process = require("child_process"),
  dirExp = require("node-dir"),
  util = require('util'),
  path = require("path"),
  fs = require("fs");

module.exports = function(app, upload){

  var 
    movieDir = app.get("movieDir"),
    encodeDir = app.get("encodeDir"),
    uploadDir = app.get("uploadDir"),
    fileEncodeOptions = {
      encoder: "x264",
      "keep-display-aspect":true,
      modulus:16,
      vb:"2500",
      quality:"20",
      "crop":"0:0:0:0"
    },
    movieExts = app.get("movieExtensions") || ["mp4"],
    encodeQueue = {},
    PATHSEP = path.sep;

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

    fileEncodeOptions.input = uploadDir + '/' + fileInfo.name;
    fileEncodeOptions.output = fileInfo.fileOut;
    encodeQueue[fileInfo.nameNoExt] = {};

    //DEBUG
    console.log("Adding file to encode QUEUE: %s", fileInfo.nameNoExt);

    var handle = handbrake.spawn(fileEncodeOptions)
    .on("complete", function(params){ 
      console.log("FINISH encoding for: \n\t%s", fileInfo.nameNoExt);
      fm.move(fileInfo.fileOut, "../videos", function(err){ 
          if(err)
              console.log(err);
      });
      delete encodeQueue[fileInfo.nameNoExt];
      fs.unlink(fileEncodeOptions.input,function(err){
        if(err)
          console.log(err);
      });
    });

    setupEndpoint(handle, fileInfo.nameNoExt);
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

  var getProcessing = function(cb) {
    var videoList = [];
    
    //Recursively get all files in dir
    dirExp.files(encodeDir, function(err,files) { if(err) console.log(err);
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
  }

  //DEBUG - send a static video to encoding
  // app.use("/encode/test", function(req, res, next){
  //   var 
  //     fileInfo = {
  //       "name": 'souls.avi',
  //       "fileOut": './lol.mp4',
  //       "nameNoExt": 'souls',
  //       "dir": './'
  //     };

  //   encodeUploadedMovie(fileInfo);
  //   res.send(200);
  // });
  // app.use("/encode/testFlush", function(req, res, next) {
  //   encodeQueue = {};
  //   console.log("Encode Queue flushed");
  // })
  // app.use("/encode/testInit", function(req, res, next) {
  //   console.log("Encode Queue flushed");
  //   encodeQueue["mock"] = {
  //     "complete" : (function(){return Math.random(0,1) * 100;})(),
  //     "eta": "01h02m03s"
  //   };
  //   encodeQueue["souls"] = {
  //     "complete" : (function(){return Math.random(0,1) * 100;})(),
  //     "eta": "01xx"
  //   };
  //   console.log("Test Queue created");
  //   console.log("Available props: \n" + util.inspect(encodeQueue));

  //   res.send(200);
  // })

  app.get("/encode/status/:filename", function(req, res, next) {
    
    if(!req.params.filename) { // Either video was finished encoding or never existed
      res.send(400);
      return;
    }

    // DEBUG
    console.log("GET endpoint for: %s", req.params.filename);

    var filename = req.params.filename;

    if(!encodeQueue[req.params.filename]) {
      res.send(404);
    } else {
      res.json(encodeQueue[filename])
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

  return {
    "getProcessing": getProcessing
  }
}