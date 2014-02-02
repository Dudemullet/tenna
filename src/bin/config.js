"use strict";

module.exports = 
    (function () {return {
        "movieExtensions": ["mp4","avi"],
        "fileExtensions": ["jpeg","jpg","png"] ,
        "movieDir": "videos",
        "fileDir": "wallpapers",
        "getSupportedExtensions" : function() { return this.movieExtensions.concat(this.fileExtensons);},
        "port":"8081"
    }})();