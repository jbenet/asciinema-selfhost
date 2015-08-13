#!/usr/bin/env node

var usage = 'Usage: asciinema-selfhost --clone <asciinema-id> [<path>]\n'
  + '       asciinema-selfhost --rehost <asciinema-id>\n\n'
  + 'Clone asciinemas as small static websites, and then self host them\n'
  + 'on any webserver. Or use --rehost to publish them straight to ipfs!'

var as = require('./')
var opt = require('optimist')
  .usage(usage)
  .boolean('h').alias('h', 'help').describe('h', 'show this help output')
  .boolean('c').alias('c', 'clone').describe('c', 'clone asciinema')
  .boolean('j').alias('j', 'json').describe('j', 'fetch asciinema.json')
  .boolean('s').alias('s', 'size').describe('s', 'fetch asciinema size')
  .boolean('r').alias('r', 'rehost').describe('r', 'rehost asciinema to ipfs')

if (opt.argv.h || opt.argv._.length < 1) {
  process.stdout.write(opt.help())
  process.exit(0)
}

if (opt.argv.j) {

  as.getAsciinemaJSON(opt.argv._[0], function(err, data) {
    if (err) throw err
    process.stdout.write(JSON.stringify(data))
    process.stdout.write('\n')
  })

} else if (opt.argv.s) {

  as.getAsciinemaSize(opt.argv._[0], function(err, data) {
    if (err) throw err
    process.stdout.write(JSON.stringify(data))
    process.stdout.write('\n')
  })

} else if (opt.argv.c) {

  var path = (opt.argv._.length > 1) ? opt.argv._[1] : null
  as.cloneAsciinema(opt.argv._[0], path, function(err, data) {
    if (err) throw err
  })

} else if (opt.argv.r) {

  as.rehostAsciinema(opt.argv._[0], function(err, hash) {
    if (err) throw err

    console.log('view locally at http://localhost:8080/ipfs/' + hash)
    console.log('view globally at http://gateway.ipfs.io/ipfs/' + hash)
  })
}
