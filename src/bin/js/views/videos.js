"use strict";

module.exports = Backbone.View.extend({
  className : "tile col-xs-12 col-sm-4 col-md-3 col-lg-3",
  template: _.template($("#videoicontemplate").html()),
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});
