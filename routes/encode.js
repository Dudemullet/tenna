"use strict";
var 
  handbrake = require("handbrake-js"),
  child_process = require("child_process");

module.exports = function(app, upload){

  var 
    movieDir = app.get("movieDir"),
    encodeDir = app.get("encodeDir"),
    fileEncodeOptions = {
      encoder: "x264",
      "keep-display-aspect":true,
      modulus:16,
      vb:"2500",
      quality:"20",
      "crop":"0:0:0:0"
    },
    movieExts = app.get("movieExtensions") || ["mp4"];

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
    fileInfo.dir = encodeDir;

    encodeUploadedMovie(fileInfo);
  });

  var encodeUploadedMovie = function(fileInfo) {
    var
      filename = fileInfo.name,
      fileOut = fileInfo.fileOut,
      fm = upload.fileManager({
        uploadDir: function() {
          return fileInfo.dir;
        }
      });

    fileEncodeOptions.input = fileInfo.dir + '/' + fileInfo.name;
    fileEncodeOptions.output = fileOut;

    handbrake.spawn(fileEncodeOptions)
    .on("error", function(err){
        console.log(err.message);
        console.log(err);
    })
    .on("output", console.log)
    .on("progress", function(progress){
      console.log(progress);
    })
    .on("complete", function(params){ 
      console.log("FINISH encoding for: \n\t%s", fileInfo.nameNoExt);
      fm.move(fileOut, "../videos", function(err){ 
          if(err)
              console.log(err);
      });
    });
  }

  app.use("/test", function(req, res, next){
    var 
      fileInfo = {
        "name": './souls.mp4',
        "fileOut": './lol.mp4',
        "nameNoExt": 'souls',
        "dir": './'
      };

    encodeUploadedMovie(fileInfo);
    res.status(200);
  });
}