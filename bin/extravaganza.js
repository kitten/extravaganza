#!/usr/bin/env node

const commander = require('commander')
const version = require('../package.json').version

commander
  .version(version)
  .command('dev', 'contionuously watches files and spins up a development server', {
    isDefault: true
  })
  .command('build', 'builds the project outputting compiled slides')
  .command('start', 'runs a previously built project')
  .parse(process.argv)
