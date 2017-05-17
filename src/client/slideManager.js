import mitt from 'mitt'
import { matchPath, history } from 'react-router-dom'
import Loadable from 'react-loadable'

import Loading from './components/loading'

const routeMatchesIndex = index => matchPath(
  window.location.pathname, { path: `/${index}` }
) !== null

const LOCALSTORAGE_KEY = 'extravaganza-state'

const storeState = index => (
  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify({
    slide: index
  }))
)

class SlideManager {
  constructor(slideLoaders = [], slideNames = []) {
    const slides = slideLoaders
      .map((loader, index) => {
        const routeName = slideNames[index]
        const component = Loadable({
          loader,
          resolveModule: module => module.default,
          LoadingComponent: Loading,
          delay: 200
        })

        return {
          component,
          routeName
        }
      })

    if (window.__HOT_MIDDLEWARE__) {
      window.__HOT_MIDDLEWARE__.subscribe(({ action }) => {
        if (action !== 'changed') {
          return
        }

        const checkIdle = status => {
          if (status === 'idle') {
            module.hot.removeStatusHandler(checkIdle)

            // Notify app of changes
            console.log('[Extravaganza] Hot reloading slides')
            this.emitter.emit('hotReload')
          }
        }

        module.hot.status(checkIdle)
      })
    }

    this.slideLoaders = slideLoaders
    this.slides = slides
    this.emitter = mitt()
  }

  getSlides() {
    return this.slides
  }

  subscribe(cb) {
    this.emitter.on('hotReload', cb)
    return () => this.emitter.off('hotReload', cb)
  }

  preload(index) {
    this.slideLoaders[index]()
  }

  getActiveSlide() {
    const index = this.slides.findIndex((_, index) => routeMatchesIndex(index))
    return index
  }

  gotoNext(push) {
    const index = this.getActiveSlide()
    const nextIndex = index + 1

    if (nextIndex < this.slides.length) {
      push(`/${nextIndex}`)
      this.preload(nextIndex + 1)
      storeState(nextIndex)
    }
  }

  gotoPrev(push) {
    const index = this.getActiveSlide()
    const nextIndex = index - 1

    if (nextIndex >= 0) {
      push(`/${nextIndex}`)
      this.preload(nextIndex - 1)
      storeState(nextIndex)
    }
  }

  updateState({ key, newValue }, push) {
    if (key === LOCALSTORAGE_KEY) {
      const { slide } = JSON.parse(newValue)
      const index = this.getActiveSlide()

      if (
        typeof slide === 'number' &&
        slide >= 0 &&
        slide < this.slides.length &&
        slide !== index
      ) {
        push(`/${slide}`)
      }
    }
  }
}

export default SlideManager
