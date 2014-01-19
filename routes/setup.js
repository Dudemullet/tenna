"use strict";
var fs = require('fs');
var escape = require('escape-html');
module.exports = function(app) {
    var watchedDirs = [];

    app.get('/setup', function(req, res, next){
        res.render("setup_view");
    });
}