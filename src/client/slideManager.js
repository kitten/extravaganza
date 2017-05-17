import mitt from 'mitt'
import { matchPath, history } from 'react-router-dom'
import Loadable from 'react-loadable'

import { loadSlide } from './utils/slideLoaders'
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
  constructor() {
    const slideNames = window.__SLIDES__ || []

    this.slideNames = slideNames
    this.slides = []
    this.emitter = mitt()
    this.loadSlide = loadSlide
    this.ready$ = this.prepareSlides(slideNames, true)
  }

  waitUntilReady() {
    return this.ready$
  }

  prepareSlides(slideNames, preloadFirst = false) {
    this.isReady = false

    return Promise.all(
      slideNames.map(async (routeName, index) => {
        const loader = () => this.loadSlide(routeName)

        const component = (preloadFirst && routeMatchesIndex(index)) ?
          (await loader()).default :
          Loadable({
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
    ).then(slides => {
      this.slides = slides
      return this
    })
  }

  updateSlides() {
    return this.prepareSlides(this.slideNames).then(() => {
      this.emitter.emit('hotReload', this.slides)
    })
  }

  getSlides() {
    return this.slides
  }

  subscribe(cb) {
    this.emitter.on('hotReload', cb)
    return () => this.emitter.off('hotReload', cb)
  }

  preload(index) {
    if (index >= 0 && index < this.slideLoaders.length) {
      this.slideLoaders[index]()
    }
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

const slideManager = new SlideManager()

if (window.__HOT_MIDDLEWARE__) {
  window.__HOT_MIDDLEWARE__.subscribe(({ action, slides }) => {
    if (action !== 'changed') {
      return
    }

    slideManager.slideNames = slides

    /*
    const checkIdle = status => {
      if (status === 'idle') {
        module.hot.removeStatusHandler(checkIdle)
      }
    }

    module.hot.status(checkIdle)
    */
  })
}

if (module.hot) {
  module.hot.accept('./utils/slideLoaders', () => {
    slideManager.loadSlide = require('./utils/slideLoaders').loadSlide
    slideManager.updateSlides()
  })
}

export default slideManager
