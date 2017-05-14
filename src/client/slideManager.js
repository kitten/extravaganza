import mitt from 'mitt'
import { matchPath, history } from 'react-router-dom'
import Loadable from 'react-loadable'

import Loading from './loading'

const ensure = slideLoader => () => (
  new Promise(resolve => slideLoader(resolve))
)

const routeMatchesIndex = index => matchPath(
  window.location.pathname, { path: `/${index}` }
) !== null

class SlideManager {
  constructor(slideLoaders, slides = []) {
    this.slideLoaders = slideLoaders
    this.slides = slides
    this.emitter = mitt()
  }

  static async init(_slideLoaders) {
    const slideLoaders = Object
      .keys(_slideLoaders)
      .map((routeName, index) => {
        const { slideLoader } = _slideLoaders[routeName]()

        const entry = { routeName }
        entry.loader = () => new Promise(resolve => {
          slideLoader(component => {
            entry.isLoaded = true
            resolve(component)
          })
        })

        return entry
      })

    const slides = await Promise.all(
      slideLoaders.map(async ({ routeName, loader }, index) => {

        let component
        if (routeMatchesIndex(index)) {
          // Preload slide if it's active
          component = (await loader()).default
        } else {
          component = Loadable({
            loader,
            resolveModule: module => module.default,
            LoadingComponent: Loading,
            delay: 200
          })
        }

        return {
          component,
          routeName
        }
      })
    )

    const slideManager = new SlideManager(slideLoaders, slides)

    if (window.__HOT_MIDDLEWARE__) {
      window.__HOT_MIDDLEWARE__.subscribe(({ action }) => {
        if (action !== 'changed') {
          return
        }

        const checkIdle = status => {
          if (status === 'idle') {
            module.hot.removeStatusHandler(checkIdle)
            slideManager.notifyChanged()
          }
        }

        module.hot.status(checkIdle)
      })
    }

    return slideManager
  }

  notifyChanged(routeNames = []) {
    console.log('[Extravaganza] Hot reloading slides')
    this.emitter.emit('hotReload')
  }

  getSlides() {
    return this.slides
  }

  subscribe(cb) {
    this.emitter.on('hotReload', cb)
    return () => this.emitter.off('hotReload', cb)
  }

  gotoNext(push) {
    const index = this.slides.findIndex((_, index) => routeMatchesIndex(index))

    if (index + 1 < this.slides.length) {
      push(`/${index + 1}`)
    }
  }

  gotoPrev(push) {
    const index = this.slides.findIndex((_, index) => routeMatchesIndex(index))

    if (index - 1 >= 0) {
      push(`/${index - 1}`)
    }
  }
}

export default SlideManager
