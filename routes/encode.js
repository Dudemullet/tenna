"use strict";

var 
  handbrake = require("handbrake-js"),
  dirExp = require("node-dir"),
  util = require('util'),
  path = require("path"),
  fs = require("fs");

module.exports = function(app, upload) {
  var // App level variables
    // encodeDir = app.get("encodeDir") || "./build/encode",
    // videoDir = app.get("movieDir") || "./build/videos",
    // uploadDir = app.get("uploadDir") || "./build/encode",
    encodeDir = "./build/encode",
    videoDir = "./build/videos",
    uploadDir = "./build/encode",

    // Module variables
    fileEncodeOptions = {
      encoder: "x264",
      "keep-display-aspect":true,
      modulus:16,
      vb:"2500",
      quality:"20",
      "crop":"0:0:0:0"},
    movieExt = ".mp4",
    encodeQueue = {},
    PATHSEP = path.sep;

  var serverConfig = function(app, upload) {
    uploadDir = "./build/uploads";
    upload.on("end", uploadFinished);
    setupRoutes(app);
  }

  var setupRoutes = function(app) {
    app.get("/encode/status/:filename", function(req, res, next) {
    
      if(!req.params.filename) { // Either video was finished encoding or never existed
        res.send(400);
        return;
      }

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
  }

  var uploadFinished = function(fileInfo) {
    var 
      vid = PendingVideo(fileInfo);

    fileEncodeOptions.input = vid.tmpName;
    fileEncodeOptions.output = vid.tmpName;

    encodeUploadedMovie(vid, fileEncodeOptions);
  }

  var encodeUploadedMovie = function(fileInfo, encOptions) {
    //DEBUG
    console.log("Adding file to encode QUEUE: %s", fileInfo.name);
    console.log("encOptions", encOptions);
    console.log("fileInfo", fileInfo);

    var handle = handbrake.spawn(encOptions)
    .on("complete", function(params) {
      console.log("FINISH encoding for: \n\t%s", fileInfo.name);
      encodeComplete(fileInfo)
    });

    setupEndpoint(handle, fileInfo.uniqueKey);
  }

  var encodeComplete = function(fileInfo) {
    var endName = videoDir + "/" + fileInfo.name + movieExt;
    
    console.log("Moving encoded file to dir: " + endName);
    // move to video dir
    fs.rename(fileInfo.tmpName, endName, function(err) {
      if(err)
        console.log(err);
    })

    //remove from encode  queue
    delete encodeQueue[fileInfo.uniqueKey];
    
    //remove from upload dir
    fs.unlink(fileInfo.uploadDirFile,function(err){
      if(err)
        console.log(err);
    });
  }

  var setupEndpoint = function(handle, fileId) {
    encodeQueue[fileId] = {};

    handle.on("error", function(err){
        console.log(err.message);
        delete encodeQueue[fileId];
    })
    .on("progress", function(progress){
      console.log("P2 - progress " + progress.percentComplete + " ETA: " + progress.eta);
      encodeQueue[fileId].eta = progress.eta;
      encodeQueue[fileId].complete = progress.percentComplete;
    });
  }

  /*
    Get a list of the videos currently being encoded
  */
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

  /** Pending video

    filename - filename (includes extension)
    name - filename with no extension
    uniqueKey - key to set the tmp filename to
    extension - file extension ie. mp4, avi, etc...
    tmpName - filename using unique key
  */
  function PendingVideo(fileInfo) {
    if(!(this instanceof PendingVideo))
      return new PendingVideo(fileInfo);
    
    this.filename = fileInfo.name;
    this.uniqueKey = "a" + Date.now();
  };

  PendingVideo.prototype = {
    get tmpName(){
      return encodeDir + '/' + this.uniqueKey + movieExt
    },
    get extension() {
      return path.extname(this.filename);
    },
    get name() {
      return path.basename(this.filename,this.extension);
    },
    get uploadDirFile() {
      if(typeof uploadDir === 'undefined')
        uploadDir == '';
      return uploadDir + '/' + this.filename;
    }
  };

  if(arguments.length == 2) {
    serverConfig(app, upload);
    return {"getProcessing": getProcessing};
  } else {
    // cli init
    console.log('console init');
    uploadDir = "./build/encode";
    var encodeVid = function(file, out) {
      fileEncodeOptions.input = file;
      fileEncodeOptions.output = out;

      return handbrake.spawn(fileEncodeOptions)
    }

    return {
      encode:encodeVid
    };
  }
}