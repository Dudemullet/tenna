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
    console.info("File added to encode dir: \n\t%s", fileInfo.name);
    
    var 
      filename = fileInfo.name,
      fileExt = filename.substr(filename.lastIndexOf(".")+1),
      fname_noExt = filename.substr(0,filename.lastIndexOf(".")),
      fileOut = encodeDir + '/' + fname_noExt + '.mp4',
      fm = upload.fileManager({
        uploadDir: function() {
          return encodeDir;
        }
      });

    if(!movieExts[fileExt]) {
      console.info("Unsupported encode file: %s", filename);
      return;
    }
    
    fileEncodeOptions.input = encodeDir + '/' + fileInfo.name;
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
      console.log("FINISH encoding for: \n\t%s", fname_noExt);
      fm.move(fileOut, "../videos", function(err){ 
          if(err)
              console.log(err);
      });
    });
  });
}