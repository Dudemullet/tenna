"use strict";

var 
  handbrake = require("handbrake-js"),
  util = require('util'),
  path = require("path"),
  fs = require("fs"),
  EventEmitter = require('events').EventEmitter, 
  _ = require('lodash'),
  uid = require('uid2');
  
var Encoder = function (options) {
    // Module variables
    this.fileEncodeOptions = _.defaults({}, options, {
        encoder: "x264",
        "keep-display-aspect":true,
        modulus:16,
        vb:"2500",
        quality:"20",
        "crop":"0:0:0:0"});
    this.encodeStates = {};
    this.events = new EventEmitter();
};

_.extend(Encoder.prototype, {
    encode: function (input, outputDir) {
        var encodeStates = this.encodeStates;
        var id = uid(24);
        var theseEvents = new EventEmitter();

        var vid = theseEvents.vid = encodeStates[id] = {
            id: id,
            input: input,
            output: outputDir + '/' + id
        };
        var encOptions = _.extend({}, this.fileEncodeOptions, {
            input: vid.input,
            output: vid.output
        });
        console.log("Adding to encode QUEUE: ", encOptions);

        handbrake.spawn(encOptions)
            .on('error', function (err) {
                console.log('Error while encoding ', vid, ': ', err);
                delete encodeStates[id];
                err.vid = vid;
                theseEvents.emit('error', err);
            })
            .on('progress', function (progress) {
                vid.progress = progress;
                theseEvents.emit( 'progress', vid);
            })
            .on("complete", function(params) {
                console.log("FINISH encoding ", vid, "\n\t");
                vid.progress = 'complete';
                delete encodeStates[id];
                theseEvents.emit('complete', vid);
            });

        return theseEvents;
    }
});


module.exports = function (options) {
    return new Encoder(options);
};
