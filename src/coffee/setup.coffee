"use strict"
progbar = $('.progress-bar')

$('#fileupload').fileupload({ dataType: 'json' })
  .on 'fileuploadstart', (e, data) ->
    progbar.css('width', 0)  
  .on 'fileuploadprogressall', (e, data) ->
    progress = parseInt(data.loaded / data.total * 100, 10)
    progbar.css('width',progress + '%')