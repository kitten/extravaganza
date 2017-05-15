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

const preload = (slideLoaders, index) => {
  if (index >= slideLoaders.length || index < 0) {
    return
  }

  const { isLoaded, loader } = slideLoaders[index]
  if (!isLoaded) {
    loader()
  }
}

class SlideManager {
  constructor(slideLoaders = [], slides = []) {
    this.slideLoaders = slideLoaders
    this.slides = slides
    this.emitter = mitt()
  }

  static async init(_slideLoaders) {
    const slideLoaders = Object
      .keys(_slideLoaders)
      .map((routeName, index) => {
        const { slideLoader } = _slideLoaders[routeName]()

        const entry = { routeName, isLoaded: false }
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

          setTimeout(() => {
            preload(slideLoaders, index - 1)
            preload(slideLoaders, index + 1)
          })
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

  preload(index) {
    preload(this.slideLoaders, index)
  }

  gotoNext(push) {
    const index = this.slides.findIndex((_, index) => routeMatchesIndex(index))
    const nextIndex = index + 1

    if (nextIndex < this.slides.length) {
      push(`/${nextIndex}`)
      this.preload(nextIndex + 1)
    }
  }

  gotoPrev(push) {
    const index = this.slides.findIndex((_, index) => routeMatchesIndex(index))
    const nextIndex = index - 1

    if (nextIndex >= 0) {
      push(`/${nextIndex}`)
      this.preload(nextIndex - 1)
    }
  }
}

export default SlideManager
