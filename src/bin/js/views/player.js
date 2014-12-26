"use strict";

module.exports = Backbone.View.extend({

  template: _.template($("#playerTemplate").html()),

  initialize: function() {
    this.listenTo(this.model, "destroy", this.remove);
    this.listenTo(this.model, "tenna:play", this.play);
  },

  render: function() {
    this.setElement(this.template(this.model.toJSON()));
    return this;
  },

  toggle: function(show) {
    if(typeof show === "undefined")
      this.$el.toggleClass("hide");
    else
      this.$el.toggleClass("hide",show);
  },

  show: function() {
    this.toggle(false);
  },

  hide: function() {
    this.toggle(true);
  },

  play: function() {
    this.show();
    this.el.play();
  },

  stop: function() {
    this.el.pause();
    this.hide();
  },
});
