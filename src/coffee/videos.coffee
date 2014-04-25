
videoPlayer = ($video) ->
  $video[0].play()  

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
    videoPlayer($(this).find("video"))


window['__onGCastApiAvailable'] = (loaded, errorInfo) ->
  if !loaded 
    console.log 'chromecast load failed: ', errorInfo
    return

  console.log 'chromecast available'
  chromecast = {}

  onInitialize = () ->
    console.log 'chromecast initialized'

  onMedia = (how, media) ->
    console.log 'got media: ', how, media
    return

  onSession = (e) ->
    chromecast.session = e;
    videoPlayer = ($video) ->
      if !chromecast.session
        console.log 'no session'
        return

      videoURL = $video.find('source').attr('src')
      mediaURL = 'http://' + window.location.host + videoURL
      console.log 'Requesting chromecast to play: ', mediaURL
      
      mediaInfo = new chrome.cast.media.MediaInfo(mediaURL)
      mediaInfo.contentType = 'video/mp4'

      request = new chrome.cast.media.LoadRequest(mediaInfo)
      request.autoplay = true;
      request.currentTime = 0;
      
      chromecast.session.loadMedia request, onMedia, onError('load media')

  onRequestSessionSuccess = (e) -> 
    console.log ("new requested session: " + e.sessionId)
    onSession(e)

   onError = (tag) -> 
     (e) ->
        console.log 'chromecast ' + tag + ' error: ', e

  launchApp = () ->
    chrome.cast.requestSession onRequestSessionSuccess, onError('launch')

   sessionListener = (e) ->
     console.log ('Existing session: ' + e.sessionId);
     onSession(e)

   receiverListener = (e) ->
     if  (e == 'available')
       console.log "receiver found"
     else 
       console.log "receiver list empty";

  applicationID = chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
  sessionRequest = new chrome.cast.SessionRequest applicationID
  apiConfig = new chrome.cast.ApiConfig sessionRequest, sessionListener, receiverListener

  chrome.cast.initialize apiConfig, onInitialize, onError('initialize')

  $('h1').click launchApp       # need to attach this to a chromecast icon instead of the header
