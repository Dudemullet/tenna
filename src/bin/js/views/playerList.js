"use strict";

var PlayerView = require('./player.js');

module.exports = Backbone.View.extend({
  el: "#playerList",

  players: [],

  initialize: function() {
    this.render();
    this.listenTo(this.collection, "tenna:playRequest", this.videoPlayRequest);
  },

  render: function(){
    this.collection.each(function(video){
      var player = new PlayerView({ model: video});
      this.$el.append(player.render().el);
      this.players.push(player);
    },this);

    return this;
  },

  hidePlayers: function() {
    this.players.forEach(function(v){
      v.stop();
    });
  },

  playVideo: function(model) {
    model.trigger("tenna:play");
  },

  videoPlayRequest: function(model) {
    this.hidePlayers();
    this.playVideo(model);
  }
});
