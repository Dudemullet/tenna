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
    };

  upload.on("end",function(fileInfo) { 
    console.info("File added to encode dir: \n\t%s", fileInfo.name);
    
    var 
      filename = fileInfo.name,
      fname_noExt = filename.substr(0,filename.lastIndexOf(".")),
      fileOut = encodeDir + '/' + fname_noExt + '.mp4',
      fm = upload.fileManager({
        uploadDir: function() {
          return encodeDir;
        }
      });
    
    fileEncodeOptions.input = encodeDir + '/' + fileInfo.name;
    fileEncodeOptions.output = fileOut;

    console.log("START Encoding for: \n\t%s", fname_noExt);
    handbrake.spawn(fileEncodeOptions)
    .on("error", function(err){
        console.log(err.message);
        console.log(err);
    })
    .on("progress", function(progress){
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