"use strict";

module.exports = Backbone.View.extend({

  template: _.template($("#playerTemplate").html()),

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  delete: function() {
    this.model.destroy({
      success: this.remove.bind(this)
    });
  }
});
