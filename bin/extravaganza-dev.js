#!/usr/bin/env node

const server = require('../lib/server/index').default
server({ production: false })
