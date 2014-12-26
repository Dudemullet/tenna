window.$ = window.jQuery = require("jquery");
window._ = require('underscore');
window.Vue = require('vue');
window.Backbone = require('backbone');
Backbone.$ = $;

var Collection = require('./collections/videos');
var VideoList = require('./views/videoList');
var videoCollection = new Collection( JSON.parse($("#modelData").html()) );

var videoList = new VideoList({
  collection: videoCollection
});
