window.$ = window.jQuery = require("jquery");
window._ = require('underscore');
window.Vue = require('vue');
window.Backbone = require('backbone');
Backbone.$ = $;

var videos = require('./views/videoList');
var v = new videos();
