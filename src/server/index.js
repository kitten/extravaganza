import express from 'express'

import HotReloading from './hotReloading'
import requestHandler from './requestHandler'

const isProd = process.env.NODE_ENV === 'production'

const server = async () => {
  const app = express()

  let hotReloading
  if (!isProd) {
    hotReloading = new HotReloading()
    await hotReloading.start(app)
  }

  // Disable Express X-Powered-By header
  app.disable('x-powered-by')

  app.get('*', hotReloading === undefined ?
    (req, res) => res.end() :
    (req, res) => requestHandler(req, res, hotReloading)
  )

  app.listen(3000, err => {
    if (err) {
      console.error('> Unable to start the server!\n' + err.toString())
    }
  })
}

server()
