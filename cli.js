#!/usr/bin/env node
"use strict";

var 
  progress = require('progress'),
  util = require('util'),
  encoder = require('./routes/encode')(),
  fs = require('fs');

var
  bar = new progress('encoding title [:bar] :percent Elapsed: :elapseds ETA: :estimate', 
    {
      total:25
    }),
  video = "jellies.mp4",
  outputDir = ".mp4",
  handle = encoder.encode(video, outputDir);

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

handle
  .on("progress", function(progress){
    var
      eta = progress.eta<=0?"calculating...":progress.eta,
      percentRatio = progress.percentComplete/100;

    bar.update(percentRatio,{estimate:eta});
  })
  .on("complete", function(params){
    bar.terminate();
    console.log("Encode complete");
    fs.rename("lol.mp4","build/videos/lol.mp4",function(err){
      if(err)
        console.log(err);
      hostVideo();
    });
  })  