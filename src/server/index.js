import express from 'express'
import moduleAlias from 'module-alias'

import BuildStats from './buildStats'
import HotReloading from './hotReloading'
import requestHandler from './requestHandler'
import resolvePaths from '../utils/resolvePaths'
import { getContext, getBuildFolder } from '../user/config'

const server = async ({ production }) => {
  const app = express()

  // Disable Express X-Powered-By header
  app.disable('x-powered-by')

  let build
  if (!production) {
    build = new HotReloading()
    await build.start(app)
  } else {
    moduleAlias.addAlias('react', require.resolve('preact-compat'))
    moduleAlias.addAlias('react-dom', require.resolve('preact-compat'))

    build = new BuildStats()

    app.use(
      '/_extravaganza',
      express.static(
        getBuildFolder(true),
        { etag: true }
      )
    )
  }

  app.use(
    '/static',
    express.static(
      resolvePaths(getContext(), 'static/'),
      { etag: true }
    )
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
