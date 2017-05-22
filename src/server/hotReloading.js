import { createElement } from 'react'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import sort from 'alphanum-sort'

import { getBuildFolder } from '../user/config'
import resolvePaths from '../utils/resolvePaths'
import webpackCompiler from '../webpack/compiler'
import getSlideChunks from '../webpack/utils/getSlideChunks'

const deleteCache = path => {
  delete require.cache[path]
}

class HotReloading {
  constructor() {
    this.success = false
    this.slides = []
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
      this.stats = stats // Update internal stats

      const { compilation: { chunks } } = stats
      const slideChunks = getSlideChunks(chunks)
      const slides = Object.keys(slideChunks)
      const slidesKey = slides.join()

      if (this.success && slidesKey !== this.prevSlidesKey) {
        // Collect changes and send to client via hotMiddleware.publish
        this.hotMiddleware.publish({
          slides: slides.map(x => x.replace('slides/', '')),
          action: 'changed'
        })
      }

      this.prevSlidesKey = slidesKey
      this.slides = slides
      this.success = true
    })

    this.devMiddleware = webpackDevMiddleware(this.compiler, {
      publicPath: '/_extravaganza/',
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

  getSlideNames() {
    return this.slides.map(x => x.replace('slides/', ''))
  }

  getSlides() {
    return this.slides.map(routeName => {
      const requirePath = resolvePaths(
        getBuildFolder(false),
        `dist/${routeName}`
      )

      const component = () => {
        const WrappedComponent = require(requirePath).default
        return createElement(WrappedComponent)
      }

      return component
    })
  }
}

export default HotReloading
