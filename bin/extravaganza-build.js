#!/usr/bin/env node

const makeCompiler = require('../lib/webpack/compiler').default

makeCompiler({ production: true }).then(compiler => {
  compiler.run((err, stats) => {
    if (err) {
      console.log('> Extravaganza project failed to build')
      console.error(err)
      process.exit(1)
    } else {
      console.log('> Extravaganza project successfully built')
    }
  })
})
