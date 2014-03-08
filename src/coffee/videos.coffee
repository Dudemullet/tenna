$(document).ready -> 
  target = window.location.hash

  scrollToVid = (video) ->
    $video = $(video);
    scrollConf = 
      scrollTop: $video.offset().top

    $('html, body').stop().animate(scrollConf, 500, 'swing', ->
      window.location.hash = video)

  if target
    scrollToVid target

  $(".row").on "click",".tile", (evt)->
    tile = this
    $(tile).find("video")[0].play()