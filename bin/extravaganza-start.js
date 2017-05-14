#!/usr/bin/env node

process.env.NODE_ENV = 'production'

const server = require('../lib/server/index').default
server({ production: true })
