import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import sort from 'alphanum-sort'

import { getBuildFolder } from '../user/config'
import resolvePaths from '../utils/resolvePaths'
import filterSlideChunks from '../utils/filterSlideChunks'
import webpackCompiler from '../webpack/compiler'

class HotReloading {
  constructor() {
    this.success = false
  }

  prepareMiddleware(app) {
    this.compiler.plugin('done', stats => {
      this.stats = stats
      this.success = true
    })

    this.devMiddleware = webpackDevMiddleware(this.compiler, {
      publicPath: '/_extravaganza/webpack/',
      quiet: true,
      noInfo: true
    })

    this.hotMiddleware = webpackHotMiddleware(this.compiler, {
      path: '/_extravaganza/hmr',
      log: false
    })

    app.use(this.devMiddleware)
    app.use(this.hotMiddleware)
  }

  async start(app) {
    this.compiler = await webpackCompiler({ production: false })
    this.prepareMiddleware(app)

    return new Promise(resolve => {
      this.devMiddleware.waitUntilValid(stats => {
        this.stats = stats
        resolve(stats)
      })
    })
  }

  getChunks() {
    return this.stats.compilation.chunks
  }

  getSlideNames() {
    return sort(
      filterSlideChunks(this.getChunks())
        .map(({ name }) => name)
    )
  }

  getSlides() {
    return this.getSlideNames()
      .map((routeName, index) => ({
        component: require(resolvePaths(
          getBuildFolder(false),
          `dist/${routeName}`
        )).default,
        routeName,
        index
      }))
  }
}

export default HotReloading
