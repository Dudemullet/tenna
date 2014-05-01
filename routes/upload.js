"use strict";
var 
  upload = require('jquery-file-upload-middleware'),
  os = require('os'),
  _ = require('lodash');

// =====================================
//    upload route
// 
// config parameters are
// 
//    - tmpDir
//    - uploadUrl
//    - uploadDir
// =====================================
module.exports = function(app, config) {
  var
    config = _.extend({
      tmpDir: os.tmpDir(),
      uploadDir: app.get('uploadDir'),
      uploadUrl: '/upload'
    },config);

  upload.configure(config);
  app.use(config.uploadUrl, upload.fileHandler());

  return upload;
}