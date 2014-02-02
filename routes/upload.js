"use strict";
var 
  upload = require('jquery-file-upload-middleware'),
  os = require('os');

module.exports = function(app) {
  var 
    movieExtensions = app.get("movieExtensions"),
    fileExtensions = app.get("fileExtensions"),
    movieDir = "./build/" + app.get("movieDir"),
    fileDir = "./build/" + app.get("fileDir");
  
  upload.configure({
    tmpDir: os.tmpdir(),
    uploadDir: __dirname + '/../build/wallpapers',
    uploadUrl: '/upload'
  });

  app.use("/upload", upload.fileHandler());

  upload.on("end", function(fileinfo){
    var 
      fm = upload.fileManager(),
      filename = fileinfo.name,
      extension = fileinfo.extension = filename.substr(filename.lastIndexOf(".")+1);

    if(movieExtensions[extension]) {
      fm.move(fileinfo.name, "./../../" + movieDir, function(err){ 
        if(err)
          console.log(err);
      });
    }
    else if(fileExtensions[extension]) {
      fm.move(fileinfo.name, "./../../" + fileDir, function(err){ 
        if(err)
          console.log(err);
      });
    }

  });
}