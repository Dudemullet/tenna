'use strict';

var 
  express = require('express'),
  app = express(),
  fs = require('fs'),
  deployDir = "./build/",
  config = require(deployDir + "config.js"),
  path = require('path'),
  Encoder = require('./lib/encoder'),
  encoder = new Encoder();

function arrToObj(arr){
    var a = {};
    var i = arr.length;
    while(i--)
        a[arr[i]] = true;

    return a;
}

app.set("port",config.port);
app.set("movieExtensions", arrToObj(config.movieExtensions));
app.set("movieDir", deployDir + config.movieDir);
app.set("encodeDir", deployDir + config.encodeDir);
app.set("uploadDir", deployDir + 'uploads');

var 
  port = app.get("port") || 8080,
  video = require('./routes/videos')(app),
  encoding = require('./routes/encode')(app),
  setup = require('./routes/setup')(app),
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
    var out = {
      "videos":videos.slice(0,10),
    };
    res.render("index",out);
  })
});

var uploadConf = {"uploadUrl":"/upload"};
var upload = require('./routes/upload')(app, uploadConf);
upload.on("end",function(fileInfo){
  if(fileInfo.deleteUrl.match(uploadConf.uploadUrl + "-api"))
    console.log("File uploaded via api do nothing, other app logic will handle")
  else {
    encodeVideo( path.normalize("./build/uploads/"+fileInfo.name), "./build/videos");
  }
});

var encodeVideo = function(file, outFile) {
  var
    handle = encoder.encode(file, "./build/encode");
  
  handle
    .on("progress", function(progress){
      console.log("server progress");
    })
    .on("complete", function(){
      console.log("Encode complete");
    });

    var encodeComplete = function(vid, outFile) {
      console.log("Vid: "+ vid);
    }    
}

app.listen(port);
console.log('Get to app at http://' + os.hostname() + ":" + port);
