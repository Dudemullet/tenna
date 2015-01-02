window._ = require('underscore');
window.Backbone = require('backbone');
Backbone.$ = $;

var Collection = require('./collections/videos');
var VideoList = require('./views/videoList');
var PlayerList = require('./views/playerList');
var FileUpload = require('./views/fileupload');
var videoCollection = new Collection( JSON.parse($("#modelData").html()) );

var coll = { collection: videoCollection};
var videoList = new VideoList(coll);
var playerList = new PlayerList(coll);
var fileupload = new FileUpload();
