'use strict';

var 
    express = require('express'),
    app = express(),
    fs = require('fs'),
    deployDir = "./build/",
    config = require(deployDir + "config.json");

function arrToObj(arr){
    var a = {};
    var i = arr.length;
    while(i--)
        a[arr[i]] = true;

    return a;
}

app.set("port",config.port);
app.set("fileExtensions", arrToObj(config.fileExtensions));

var 
    port = app.get("port") || 8080,
    videoR = require('./routes/videos')(app),
    fileR = require('./routes/file_routes')(app),
    encoder = require('./routes/encode')(app),
    setup = require('./routes/setup')(app),
    os = require("os");

app.configure(function () {
    app.set('view engine', 'jade');
    app.set('views', deployDir + 'views');
    
    app.enable('strict routing');

    app.use(express.methodOverride());
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.responseTime());

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
    videoR.getMovies(function(files){
        var videos = files;

        fileR.getFiles(function(foundFiles){
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