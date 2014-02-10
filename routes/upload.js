"use strict";
var 
  upload = require('jquery-file-upload-middleware'),
  fs = require('fs');

module.exports = function(app) {
  var 
    movieExtensions = app.get("movieExtensions"),
    fileExtensions = app.get("fileExtensions"),
    fileDir = app.get("fileDir"),
    encodeDir = app.get("encodeDir"),
    uploadDir = app.get('uploadDir');
  
  upload.configure({
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

    if(movieExtensions[extension]) {
      fm.move(fileinfo.name, "./../../" + encodeDir, function(err){ 
        if(err)
          console.log(err);
      });
    } else if(fileExtensions[extension]) {
      fm.move(fileinfo.name, "./../../" + fileDir, function(err){ 
        if(err)
          console.log(err);
      });
    } else { //Unknown extension uploaded
      console.log("Uknown extension uploaded: %j", fileinfo);
    }
  };

  app.use("/upload", upload.fileHandler());
  upload.on("end", onUploadEnd);
  return upload;
}