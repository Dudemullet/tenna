"use strict";
var upload = require('jquery-file-upload-middleware');

module.exports = function(app) {
    
    upload.configure({
        uploadDir: __dirname + '/../build/wallpapers',
        uploadUrl: '/upload'
    });

    app.use("/upload",upload.fileHandler());
}