"use strict";

module.exports = function(app) {
    var watchedDirs = [];

    app.get('/setup', function(req, res, next){
        res.render("setup_view");
    });
}