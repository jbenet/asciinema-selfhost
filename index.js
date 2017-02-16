var fs = require('fs')
var fse = require('fs-extra')
var path = require('path')
var vinyl = require('vinyl')
var vinylfs = require('vinyl-fs')
var ipfsApi = require('ipfs-api')
var request = require('request')
var cheerio = require('cheerio')

var x = module.exports = {}
x.getAsciinemaJSON = getAsciinemaJSON
x.getAsciinemaFrame = getAsciinemaFrame
x.getAsciinemaSize = getAsciinemaSize
x.cloneAsciinema = cloneAsciinema
x.rehostAsciinema = rehostAsciinema

var embedUrl = "https://asciinema.org/api/asciicasts/"
var pageUrl = "https://asciinema.org/a/"

function getAsciinemaJSON(id, cb) {
  var url = id
  if (url.match(/^[a-zA-Z0-9]+$/))
    url = pageUrl + url
  if (!url.match(/\.json(\#.*)?(\?.*)?$/i))
    url = url + '.json'

  request(url, function(err, res) {
    if (err) return cb(err)
    if (res.statusCode != 200)
      return cb(new Error("status code not 200"))

    cb(null, JSON.parse(res.body))
  })
}

function getAsciinemaFrame(size) {
  var frame = fs.readFileSync(__dirname + "/tmpl/iframe.html").toString()
  if (size.height && size.width) {
    var str = 'height:'+ size.height +'px; width:'+ size.width +'px'
    frame = frame.replace('style="', 'style="' + str)
  }
  return frame
}

function getAsciinemaSize(id, cb) {
  getAsciinemaJSON(id, function(err, ajson) {
    if (err) return cb(err)

    var wh = {}
    wh.height = ajson.height
    wh.width = ajson.width

    if (!wh.width || !wh.height)
      return cb(new Error("parse error: missing width or height"), ajson)

    cb(null, wh)
  })
}

function cloneAsciinema(id, fpath, cb) {
  id = id.toString().split('/')
  id = id[id.length - 1]
  if (!fpath) fpath = id

  console.log('cloning', id, 'to', fpath)


  preparePath(fpath, function(err) {
    if (err) return cb(err)

    getAsciinemaJSON(id, function(err, json) {
      if (err) return cb(err)

      logWrite(fpath + '/data/asciinema.json', JSON.stringify(json), function(err) {
        if (err) return cb(err)

        getAsciinemaSize(id, function(err, size) {
          if (err) return cb(err)

          logWrite(fpath + '/data/size.json', JSON.stringify(size), function(err) {
            if (err) return cb(err)

            var frame = getAsciinemaFrame(size)
            logWrite(fpath + '/iframe.html', frame, function(err) {
              if (err) return cb(err)
              cb(null, fpath)
            })
          })
        })
      })
    })
  })
}

function logWrite(fpath, data, cb) {
  console.log('writing ' + fpath)
  fse.mkdirp(path.dirname(fpath), function(err) {
    if (err) return cb(err)
    fs.writeFile(fpath, data, cb)
  })
}

function preparePath(fpath, cb) {
  // console.log('preparing', fpath)
  fse.mkdirp(fpath, function(err) {
    if (err) return cb(err)
    console.log('copying', __dirname + '/build', 'to', fpath)
    fse.copy(__dirname + '/build', fpath, cb)
  })
}

function rehostAsciinema(id, opts, cb) {
  if (!id) throw new Error("no asciinema id given")
  if (typeof(opts) === 'function') {
    cb = opts
    opts = {}
  }
  opts = opts || {}

  id = id.split('/')
  id = id[id.length - 1]
  var ipfs = ipfsApi(opts.host, opts.port)

  var fpath = '/tmp/asciinema/' + id
  cloneAsciinema(id, fpath, function(err, fpath) {
    if (err) return cb(err)

    console.log('\nadding to ipfs. make sure your ipfs daemon is running.')
    console.log('ipfs add -r', fpath)
    ipfs.add(fpath, {recursive: true}, function(err, res) {
      if (err) return cb(err)

      var last = res[res.length-1]
      console.log('published to /ipfs/' + last.Hash)
      cb(null, last.Hash)
    })
  })
}
