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

  $(".row").on "click",".video-wrapper", (evt)->
    videoTarget = $(this).attr('id')
    $("video").each (i,e) ->
      $e = $(e)
      classToggle = $e.attr("data-vid") == videoTarget
      $e.toggleClass "hide",!classToggle
      $e.toggleClass "show",classToggle
      e.pause()

    $("video.show")[0].play()
