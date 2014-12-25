"use strict"
var videoModel = require("../models/video");

module.exports = Backbone.Collection.extend({
  model: videoModel,
  url: "/videos"
});
