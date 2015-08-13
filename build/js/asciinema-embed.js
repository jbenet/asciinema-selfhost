
function createPlayer(dataUrl, size) {
  log('creating player', dataUrl)

  asciinema.CreatePlayer(
    document.getElementById('player-container'),
    size.width, size.height,
    dataUrl,
    52,
    {
      speed: 1,
      autoPlay: false,
      loop: false,
      fontSize: 'small',
      theme: 'tango'
    }
  )
}

function postSizeToParent() {
  log('posting size to parent')

  var target = parent.postMessage ? parent :
    (parent.document.postMessage ? parent.document : undefined)

  if (typeof target != "undefined" && window !== window.parent) {
    var w = $('.asciinema-player').width()
    var h = $('.asciinema-player').height()
    target.postMessage(['asciicast:size', { width: w, height: h }], '*')
  }
}

function setupMessageHandler() {
  function onMessage(e) {
    var event = e.data[0];
    log('received event', event)

    switch (event) {
    case 'asciicast:play': $('.start-prompt').click(); break
    case 'asciicast:size': postSizeToParent(); break
    default:
      log('unknown event: ' + event)
    }
  }

  log('setup message handler')
  window.addEventListener("message", onMessage, false);
}

function loadAsciinema(dataUrl, sizeUrl) {
  var req = $.ajax({ url: sizeUrl, dataType: 'json' })
  req.done(function(size) {
    log('loaded size: ' + size.width+'x'+size.height)
    createPlayer(dataUrl, size)
  })
  req.fail(function(jqXHR, textStatus) {
    console.error(sizeUrl, textStatus)
  })
}

// send message to parent when we're ready.
$(document).ready(function() {
  loadAsciinema('./data/asciinema.json', './data/size.json')
  // setupMessageHandler()
  // signalFrameToParent()
})

function log() {
  var args = Array.prototype.slice.call(arguments, 0)
  args = ['asciinema-embed:'].concat(args)
  console.log.apply(console, args)
}
