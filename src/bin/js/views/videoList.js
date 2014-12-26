"use strict";

var VideoView = require('./videos.js');

module.exports = Backbone.View.extend({
  el: "#videolist",

  initialize: function() {
    this.render();
  },

  render: function(){
    this.collection.each(function(video){
      var video = new VideoView({ model: video});
      this.$el.append(video.render().el);
    },this);

    return this;
  }
});
