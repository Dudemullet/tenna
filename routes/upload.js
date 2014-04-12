"use strict";
var 
  upload = require('jquery-file-upload-middleware'),
  fs = require('fs'),
  os = require('os');

module.exports = function(app) {
  var 
    subExt = "vtt",
    fileDir = app.get("fileDir"),
    uploadDir = app.get('uploadDir');
  
  upload.configure({
    tmpDir: os.tmpDir(),
    uploadDir: uploadDir,
    uploadUrl: '/upload'
  });

  var onUploadEnd = function(fileinfo) {
    var 
      filename = fileinfo.name,
      extension = fileinfo.extension = filename.substr(filename.lastIndexOf(".")+1),
      fm = upload.fileManager({ //We do this here because we're recylcing this in encode.js
        uploadDir: function() {
          return uploadDir;
        }
      });

    if(extension != subExt) {
      fm.move(fileinfo.name, "./../../" + fileDir, function(err){ 
        if(err)
          console.log(err);
      });
    }
  };

  app.use("/upload", upload.fileHandler());
  upload.on("end", onUploadEnd);
  return upload;
}