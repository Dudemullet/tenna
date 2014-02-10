$(document).ready -> 
  target = window.location.hash
  $target = $(target);
  scrollConf = 
    scrollTop: $target.offset().top

  $('html, body').stop().animate(scrollConf, 500, 'swing', ->
    window.location.hash = target)