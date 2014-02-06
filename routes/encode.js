"use strict";
var 
    handbrake = require("handbrake-js"),
    child_process = require("child_process");

module.exports = function(app){

    var options = {
        input: "class.mp4",
        output: "test.mp4",
        encoder: "x264",
        "keep-display-aspect":true,
        modulus:16,
        vb:"2500",
        quality:"20",
        "crop":"0:0:0:0"
    };

    app.get('/encode', function(req, res){
        handbrake.spawn(options)
        .on("error", function(err){
            console.log(err.message);
        })
        .on("output", console.log)
        .on("progress", function(progress){
            console.log(progress.task + ": " + progress.percentComplete);
        })
        .on("complete", function(){ 
            
        });
        res.send(200);
    });
}