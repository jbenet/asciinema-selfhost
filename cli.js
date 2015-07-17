#!/usr/bin/env node

var as = require('./')

as.getAsciinemaJSON(process.argv[2], function(err, data) {
  if (err) throw err

  console.log(JSON.stringify(data))
})
