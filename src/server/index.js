import express from 'express'
import compression from 'compression'
import BuildStats from './buildStats'
import HotReloading from './hotReloading'
import requestHandler from './requestHandler'
import resolvePaths from '../utils/resolvePaths'
import emptyServiceWorker from './utils/emptyServiceWorker'
import { getContext, getBuildFolder } from '../user/config'

const server = async ({ production }) => {
  const app = express()

  app.disable('x-powered-by')
  app.use(compression())

  let build
  if (!production) {
    build = new HotReloading()
    await build.start(app)

    app.get('/sw.js', (req, res) => {
      res.status(200).type('application/javascript').send(emptyServiceWorker)
    })
  } else {
    build = new BuildStats()

    app.use(
      '/_extravaganza',
      express.static(getBuildFolder(true), { etag: true })
    )

    app.get('/sw.js', (req, res) => {
      res.sendFile(resolvePaths(getBuildFolder(true), 'sw.js'))
    })
  }

  app.use(
    '/static',
    express.static(resolvePaths(getContext(), 'static/'), { etag: true })
  )

  app.get('*', (req, res) => {
    requestHandler(req, res, { build, production })
  })

  app.listen(3000, err => {
    if (err) {
      console.log('> Unable to start the server!')
      console.error(err)
      process.exit(1)
    }

    console.error(`> Started a server listening on port ${3000}.`)
  })
}

export default server
