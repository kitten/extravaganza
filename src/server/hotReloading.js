import Loadable from 'react-loadable'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import sort from 'alphanum-sort'

import { getBuildFolder } from '../user/config'
import resolvePaths from '../utils/resolvePaths'
import filterSlideChunks from '../utils/filterSlideChunks'
import webpackCompiler from '../webpack/compiler'

const deleteCache = path => {
  delete require.cache[path]
}

class HotReloading {
  constructor() {
    this.success = false
  }

  prepareMiddleware(app) {
    // Purge outdated assets from module cache
    this.compiler.plugin('after-emit', (compilation, callback) => {
      const { assets } = compilation

      if (this.prevAssets !== undefined) {
        for (const assetKey of Object.keys(assets)) {
          deleteCache(assets[assetKey].existsAt)
        }

        for (const assetKey of Object.keys(this.prevAssets)) {
          if (!assets[assetKey]) {
            deleteCache(this.prevAssets[assetKey].existsAt)
          }
        }
      }

      this.prevAssets = assets
      callback()
    })

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
      .map((routeName, index) => {
        const requirePath = resolvePaths(getBuildFolder(false), `dist/${routeName}`)
        const component = Loadable({
          serverSideRequirePath: requirePath,
          resolveModule: module => module.default
        })

        return {
          component,
          routeName,
          index
        }
      })
  }
}

export default HotReloading
