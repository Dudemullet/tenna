$(document).ready ->

  scrollToVid = (video) ->
    $video = $(video);
    if $video.length != 1
      console.log 'bad video target: ', video
      window.location.hash = ''
      return

    scrollConf = 
      scrollTop: $video.offset().top

    $('html, body').stop().animate(scrollConf, 500, 'swing', ->
      window.location.hash = video)

  target = window.location.hash
  if target
    scrollToVid target

  $(".row").on "click",".tile", (evt)->
    tile = this
    $(tile).find("video")[0].play()
