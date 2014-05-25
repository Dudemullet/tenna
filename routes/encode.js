"use strict";

var 
  handbrake = require("handbrake-js"),
  dirExp = require("node-dir"),
  util = require('util'),
  path = require("path"),
  fs = require("fs"),
  Encoder = require(__dirname + '/../lib/encoder'),
  EventEmitter = require('events').EventEmitter,
  _ = require('lodash');


module.exports = function(app) {
  var // App level variables
    encoder = new Encoder(),
    PATHSEP = path.sep,
    events = new EventEmitter();

    app.get("/encode/status/:filename", function(req, res, next) {
        
        if(!req.params.filename) { // Either video was finished encoding or never existed
            res.send(400);
            return;
        }

        var filename = req.params.filename;

        if(!encoder.encodeStates.hasOwnProperty(filename)) {
            res.send(404);
        } else {
            res.json(encoder.encodeStates[filename].progress)
        }
    });

    app.get('/encode', function(req, res, next) {
        console.log("GET: encode");
        getProcessing(function(videoList) {
          console.log("VIDEOLIST: " + util.inspect(videoList));
            res.render("encode",{"processing":videoList});
        });
    });

    app.get('/get/processing', function(req, res, next) {
        console.log("GET processing videos JSON list");
        getProcessing(function(videoList) {
            res.json(videoList)
        });
    });  

    /*
      Get a list of the videos currently being encoded
    */
    var getProcessing = function(cb) {
        var videoList = _.map(encoder.encodeStates, function (vid) {
            return {
                filename: path.basename(vid.input),
                name: vid.id
            };
        });
        return cb(videoList);
    };

    return {
        getProcessing: getProcessing,
        events: events
    };
};
