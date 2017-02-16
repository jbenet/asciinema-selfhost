var fs = require('fs')
var tmp = require('tmp')
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
x.hostAsciinemaFile = hostAsciinemaFile

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
    getAsciinemaSizeFromJson(ajson, cb)
  })
}

function getAsciinemaSizeFromJson(j, cb) {
  var wh = {}
  wh.height = j.height
  wh.width = j.width

  if (!wh.width || !wh.height)
    return cb(new Error("parse error: missing width or height"), j)

  cb(null, wh)
}

function setupAsciinemaDir(json, fpath, cb) {
  if (!json) return cb(new Error("asciinema json required to setup asciinema dir"))
  if (!fpath) return cb(new Error("path required to setup asciinema dir"))

  preparePath(fpath, function(err) {
  if (err) return cb(err)

    logWrite(fpath + '/data/asciinema.json', JSON.stringify(json), function(err) {
      if (err) return cb(err)

      // size broken? https://github.com/asciinema/asciinema.org/issues/234
      getAsciinemaSizeFromJson(json, function(err, size) {
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
}

function cloneAsciinema(id, fpath, cb) {
  id = id.toString().split('/')
  id = id[id.length - 1]

  console.log('cloning', id, 'to', fpath)
  getAsciinemaJSON(id, function(err, json) {
    if (err) return cb(err)
    setupAsciinemaDir(json, fpath, cb)
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
    console.log('copying', __dirname + '/tmpl', 'to', fpath)
    fse.copy(__dirname + '/tmpl', fpath, cb)
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
  var ipfs = new ipfsApi(opts.host, opts.port)

  var fpath = '/tmp/asciinema/' + id
  cloneAsciinema(id, fpath, function(err, fpath) {
    if (err) return cb(err)

    console.log('\nadding to ipfs. make sure your ipfs daemon is running.')
    console.log('ipfs add -r', fpath)
    ipfs.util.addFromFs(fpath, {recursive: true}, function(err, res) {
      if (err) return cb(err)

      var last = res[res.length-1]
      console.log('published to /ipfs/' + last.hash)
      cb(null, last.hash)
    })
  })
}

function hostAsciinemaFile(path, opts, cb) {
  if (!path) throw new Error("no asciinema file given")
  if (typeof(opts) === 'function') {
    cb = opts
    opts = {}
  }
  opts = opts || {}

  var ipfs = new ipfsApi(opts.host, opts.port)

  console.log('self-hosting asciinema', path)
  var json = JSON.parse(fs.readFileSync(path))

  var dir = tmp.dirSync({ template: '/tmp/asciinema/tmp-XXXXXX' })
  var fpath = dir.name

  setupAsciinemaDir(json, fpath, function(err, fpath) {
    if (err) return cb(err)

    console.log('\nadding to ipfs. make sure your ipfs daemon is running.')
    console.log('ipfs add -r', fpath)
    ipfs.util.addFromFs(fpath, {recursive: true}, function(err, res) {
      if (err) return cb(err)

      var last = res[res.length-1]
      console.log('published to /ipfs/' + last.hash)
      cb(null, last.hash)
    })
  })
}
