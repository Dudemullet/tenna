"use strict";

module.exports = Backbone.View.extend({
  events: {
    'click .delete-btn': 'delete',
    'click .video-wrapper': 'play'
  },

  className : "tile col-xs-12 col-sm-4 col-md-3 col-lg-3",

  template: _.template($("#videoicontemplate").html()),

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  delete: function() {
    this.model.destroy({
      success: this.remove.bind(this)
    });
  },

  play: function() {
    this.model.collection.trigger("tenna:playRequest", this.model);
  }
});
