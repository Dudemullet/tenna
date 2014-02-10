'use strict';

var 
    express = require('express'),
    app = express(),
    fs = require('fs'),
    deployDir = "./build/",
    config = require(deployDir + "config.js");

function arrToObj(arr){
    var a = {};
    var i = arr.length;
    while(i--)
        a[arr[i]] = true;

    return a;
}

app.set("port",config.port);
app.set("supportedExtensions", arrToObj(config.getSupportedExtensions()));
app.set("fileExtensions", arrToObj(config.fileExtensions));
app.set("movieExtensions", arrToObj(config.movieExtensions));
app.set("movieDir", deployDir + config.movieDir);
app.set("fileDir", deployDir + config.fileDir);
app.set("encodeDir", deployDir + config.encodeDir);
app.set("uploadDir", deployDir + 'uploads');

var 
    port = app.get("port") || 8080,
    video = require('./routes/videos')(app),
    file = require('./routes/file_routes')(app),
    upload = require('./routes/upload')(app),
    encoder = require('./routes/encode')(app,upload),
    setup = require('./routes/setup')(app),
    os = require("os");

app.configure(function () {
    app.set('view engine', 'jade');
    app.set('views', deployDir + 'views');
    
    app.enable('strict routing');

    app.use(express.methodOverride());
    app.use(express.json());
    app.use(express.urlencoded());

    // use the router
    app.use(app.router);

    // use the static router
    app.use(express.static(deployDir));
    
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.listen(port);
console.log('Get to app at http://' + os.hostname() + ":" + port);

// Routes
app.get('/', function (req, res, next) {
    video.getMovies(function(files){
        var videos = files;

        file.getFiles(function(foundFiles){
            var out = {
                "videos":videos.slice(0,10),
                "files":foundFiles.files.slice(0,10)
            };
            res.render("index",out);
        });
    })
});

//Static route to force static file download
app.get('/dl/*/*', function(req, res){
    var path = req.path;
    var fileName = path.substr(path.lastIndexOf("/")+1);
    var videoDir = 'wallpapers/';
    var sysVideoDir = deployDir + videoDir;
    
    res.set({
        "Content-type":"application/download"
    })
    res.sendfile(sysVideoDir + fileName);
});