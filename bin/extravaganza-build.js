#!/usr/bin/env node

process.env.NODE_ENV = 'production'

const makeCompiler = require('../lib/webpack/compiler').default

makeCompiler({ production: true }).then(compiler => {
  compiler.run((err, stats) => {
    if (err || stats.hasErrors()) {
      console.log('> Extravaganza project failed to build')
      console.error(err || stats.toString('errors-only'))
      process.exit(1)
    } else {
      console.log('> Extravaganza project successfully built')
    }
  })
})
