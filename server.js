'use strict';

var 
  express = require('express'),
  app = express(),
  fs = require('fs'),
  deployDir = "./build/",
  config = require(deployDir + "config.js"),
  path = require('path'),
  Encoder = require('./lib/encoder'),
  encoder = new Encoder(),
  sets = require("simplesets"),
  uploadConf = {"uploadUrl":"/upload"};

app.set("port",config.port);
app.set("movieExtensions",new sets.Set(config.movieExtensions));
app.set("movieDir", deployDir + config.movieDir);
app.set("encodeDir", deployDir + config.encodeDir);
app.set("uploadDir", deployDir + 'uploads');

var 
  port = app.get("port") || 8080,
  video = require('./routes/videos')(app),
  encoding = require('./routes/encode')(app),
  setup = require('./routes/setup')(app),
  upload = require('./routes/upload')(app, uploadConf),
  os = require("os");

app.set('view engine', 'jade');
app.set('views', deployDir + 'views');
app.enable('strict routing');

// use the static router
app.use(express.static(deployDir));

// Routes
app.get('/', function (req, res, next) {
  video.getMovies(function(videos) {
    encoding.getProcessing(function(processing) {
      var out = {
        "videos":videos.slice(0,10),
        "processing":processing 
      };
      res.render("index",out);
    })
  })
});

upload.on("end",function(fileInfo){
  var uploadedFile = path.normalize("./build/uploads/"+fileInfo.name);
  if(fileInfo.deleteUrl.match(uploadConf.uploadUrl + "-api"))
    console.log("File uploaded via api do nothing, other app logic will handle")
  else {
    encodeVideo(uploadedFile, "./build/videos");
  }
});

var encodeVideo = function(file, outFile) {
  var
    handle = encoder.encode(file, outFile);
  
  handle
    .on("progress", function(progress){
      console.log("server progress");
    })
    .on("complete", function(){
      fs.unlink(file);
    });
}

app.listen(port);
console.log('Get to app at http://' + os.hostname() + ":" + port);
