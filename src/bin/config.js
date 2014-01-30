"use strict";

module.exports = 
    (function () {return {
        "movieExtensions": ["mp4","avi"],
        "fileExtensons": ["jpeg","jpg","png"] ,
        "getSupportedExtensions" : function() { return this.movieExtensions.concat(this.fileExtensons);},
        "port":"8081"
    }})();