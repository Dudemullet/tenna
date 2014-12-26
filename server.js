'use strict';

var
  express = require('express'),
  app = express(),
  fs = require('fs'),
  deployDir = __dirname + "/build/",
  config = require(deployDir + "config.js"),
  path = require('path'),
  Encoder = require('./lib/encoder'),
  encoder = new Encoder(),
  sets = require("simplesets"),
  uploadConf = {"uploadUrl":"/upload"},
  ejs = require("ejs");

app.set("port",config.port);
app.set("movieExtensions",new sets.Set(config.movieExtensions));
app.set("movieDir", deployDir + config.movieDir);
app.set("encodeDir", deployDir + config.encodeDir);
app.set("uploadDir", deployDir + 'uploads');
app.set("views", "./views");
app.set("view engine", "ejs");
ejs.open="{{";
ejs.close="}}";
app.engine("ejs", ejs.__express);

var
  port = app.get("port") || 8080,
  video = require('./routes/videos')(app),
  encoding = require('./routes/encode')(app),
  setup = require('./routes/setup')(app),
  upload = require('./routes/upload')(app, uploadConf),
  os = require("os");

app.enable('strict routing');

// use the static router
app.use(express.static(deployDir));

app.get('/app', function(req, res, next) {
  video.getMovies(function(movies){
    res.render("index", {models: movies});
  });
});

upload.on("end",function(fileInfo){
  var uploadedFile = path.normalize( deployDir + "/uploads/" +fileInfo.name);
  if(fileInfo.deleteUrl.match(uploadConf.uploadUrl + "-api"))
    console.log("File uploaded via api");
  else {
    encodeVideo(uploadedFile, deployDir + "/videos");
  }
});

var encodeVideo = function(file, outFile) {
  var
    handle = encoder.encode(file, outFile);

  handle
    .on("complete", function(){
      fs.unlink(file);
    });
}

app.listen(port);
console.log('Get to app at http://' + os.hostname() + ":" + port);
