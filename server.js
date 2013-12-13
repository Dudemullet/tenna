'use strict';

var fs = require('fs');
var express = require('express');
var handbrake = require("handbrake-js");
var app = express();
var videoR = require('./routes/videos')(app);
var fileR = require('./routes/file_routes')(app);
var deployDir = "./build";
var os = require("os");
app.enable('strict routing');

app.configure(function () {
    app.set('view engine', 'jade');
    app.set('views', deployDir + '/views');

    app.use(express.methodOverride());
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.responseTime());

    // strip slashes
    app.use(function (req, res, next) {
        if (req.url.substr(-1) === '/' && req.url.length > 1) {
            res.redirect(301, req.url.slice(0, -1));
        } else {
            next();
        }
    });

    // use the router
    app.use(app.router);

    // use the static router
    app.use(express.static(deployDir));

    // if nothing matched, send 404
    app.use(function (req, res) {
        res.status(404).sendfile(deployDir+ '/404.html');
    });
    
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

var port = 8080;
app.listen(port);
console.log('Get to app at http://' + os.hostname() + ":" + port);

// Routes
app.get('/', function (req, res, next) {
    videoR.getMovies(function(files){
        var videos = files;
        fileR.getFiles(function(foundFiles){
            var out = {
                "videos":videos.videos,
                "files":foundFiles.files
            };
            res.render("index",out);
        });
    })
});

//Static route to force static file download
app.get('/dl/*/*', function(req, res){
    var path = req.path;
    var fileName = path.substr(path.lastIndexOf("/")+1);
    var videoDir = '/wallpapers/';
    var sysVideoDir = deployDir + videoDir;
    
    res.set({
        "Content-type":"application/download"
    })
    res.sendfile(sysVideoDir + fileName);
});

app.get('/encode', function(req, res){
    console.log("encoding video..");

    var options = {
        input: "unplayable.mp4",
        output: "test.mp4",
        encoder: "x264",
        "keep-display-aspect":true,
        modulus:16,
        vb:"2500",
        quality:"20",
        "crop":"0:0:0:0"
    };

    handbrake.spawn(options)
    .on("error", function(err){
        console.log("ERROR: " + err.message);
    })
    .on("output", console.log)
    .on("progress", function(progress){
        console.log(progress.task + ": " + progress.percentComplete);
    })
    .on("complete", function(){ 
        console.log("Done!"); 
    });
});