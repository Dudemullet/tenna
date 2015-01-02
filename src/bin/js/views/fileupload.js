"use strict";

module.exports = Backbone.View.extend({
  el:".container",

  initialize: function() {
    // var fileupload = new FileUpload();
    this.$el.fileupload({
      dataType: "json",
      url: "videos"
    });
  }
});
