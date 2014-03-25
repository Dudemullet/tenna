#!/usr/bin/env node
"use strict";

var 
  progress = require('progress'),
  util = require('util'),
  encoder = require('./routes/encode')(),
  fs = require('fs'),
  path = require('path'),
  argv = require('minimist')(process.argv.slice(2));

var
  barConfStr = 'encoding :title [:bar] :percent Elapsed: :elapseds ETA: :estimate',
  bar = new progress(barConfStr, {total:25});
  

var hostVideo = function() {
  var 
    express = require('express'),
    app = express(),
    fs = require('fs'),
    deployDir = "./build/",
    config = require(deployDir + "config.js");


  function arrToObj(arr){
      var a = {};
      var i = arr.length;
      while(i--)
          a[arr[i]] = true;

      return a;
  }

  app.set("port",config.port);
  app.set("supportedExtensions", arrToObj(config.getSupportedExtensions()));
  app.set("fileExtensions", arrToObj(config.fileExtensions));
  app.set("movieExtensions", arrToObj(config.movieExtensions));
  app.set("movieDir", deployDir + config.movieDir);
  app.set("fileDir", deployDir + config.fileDir);
  app.set("encodeDir", deployDir + config.encodeDir);
  app.set("uploadDir", deployDir + 'uploads');

  app.configure(function () {
    app.set('view engine', 'jade');
    app.set('views', deployDir + 'views');
    
    app.enable('strict routing');

    app.use(express.methodOverride());
    app.use(express.json());
    app.use(express.urlencoded());

    // use the router
    app.use(app.router);

    // use the static router
    app.use(express.static(deployDir));
    
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
  });

  var video = require('./routes/videos')(app);
  app.listen(8080);
}

var encodeVideo = function(file, outFile) {
  
  var
    handle = encoder.encode(file, outFile);
  
  handle
    .on("progress", function(progress){
      updateBar(progress, file);
    })
    .on("complete", function(params){
      encodeComplete(params, outFile);
    })
}

var updateBar = function(progress, filename) {
  var
    eta = progress.eta<=0?"calculating...":progress.eta,
    percentRatio = progress.percentComplete/100;

    bar.update(percentRatio,{"estimate":eta,"title":filename});
}

var encodeComplete =  function(params, outFile) {
  bar.terminate();
  console.log("Encode complete");
  fs.rename(outFile,"build/videos/" + outFile,function(err){
    if(err)
      console.log(err);
    hostVideo();
  });
}

// init
if(argv._.length <= 0) {
  hostVideo();
} else {
  var
    filename = path.normalize(argv._[0]),
    ext = path.extname(filename),
    base = path.basename(filename, ext);
  
  encodeVideo(filename, base + ".mp4");
}