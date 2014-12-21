"use strict"

module.exports = Backbone.Model.extend({
  initialize: function(attrs, options) {
    this.set('id', attrs.fileName);
  }
});

