var request = require('request')

var x = module.exports = {}
x.getAsciinemaJSON = getAsciinemaJSON

function getAsciinemaJSON(url, cb) {
  request(url, function(err, res) {
    if (err) return cb(err)

    var m = res.body.match(/https:\/\/asciinema-bb-eu[^"]+/gi)
    if (!m || !m[0]) return cb(new Error('no valid player json url in ' + url))

    request(m[0], function(err, res) {
      if (err) return cb(err)

      cb(null, JSON.parse(res.body))
    })
  })
}
