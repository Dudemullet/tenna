"use strict";

module.exports = Backbone.View.extend({
  events: {
    'click .delete-btn': 'delete'
  },

  className : "tile col-xs-12 col-sm-4 col-md-3 col-lg-3",

  template: _.template($("#videoicontemplate").html()),

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  delete: function() {
    this.model.destroy({
      success: function(){
        this.remove();
      }.bind(this)
    })
  }
});
