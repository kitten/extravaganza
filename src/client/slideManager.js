import mitt from 'mitt'
import { matchPath } from 'react-router-dom'
import Loadable from 'react-loadable'

import history from './history'
import { loadSlide } from './utils/slideLoaders'
import Loading from './components/loading'

const routeMatchesIndex = index =>
  matchPath(window.location.pathname, {
    path: `/${index}`,
    exact: true,
    strict: true
  }) !== null

const LOCALSTORAGE_KEY = 'extravaganza-state'

const storeState = index =>
  localStorage.setItem(
    LOCALSTORAGE_KEY,
    JSON.stringify({
      slide: index
    })
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

        const component = preloadFirst && routeMatchesIndex(index)
          ? (await loader()).default
          : Loadable({
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
    const loadable = this.slides[index]
    if (loadable !== undefined && typeof loadable.preload === 'function') {
      loadable.preload()
    }
  }

  getActiveSlide() {
    const index = this.slides.findIndex((_, index) => routeMatchesIndex(index))
    return index
  }

  gotoNext() {
    const index = this.getActiveSlide()
    const nextIndex = index + 1

    if (nextIndex < this.slides.length) {
      history.push(`/${nextIndex}`)
      this.preload(nextIndex + 1)
      storeState(nextIndex)
    }
  }

  gotoPrev() {
    const index = this.getActiveSlide()
    const nextIndex = index - 1

    if (nextIndex >= 0) {
      history.push(`/${nextIndex}`)
      this.preload(nextIndex - 1)
      storeState(nextIndex)
    }
  }

  updateState({ key, newValue }) {
    if (key === LOCALSTORAGE_KEY) {
      const { slide } = JSON.parse(newValue)
      const index = this.getActiveSlide()

      if (
        typeof slide === 'number' &&
        slide >= 0 &&
        slide < this.slides.length &&
        slide !== index
      ) {
        history.push(`/${slide}`)
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
  })
}

if (module.hot) {
  module.hot.accept('./utils/slideLoaders', () => {
    slideManager.loadSlide = require('./utils/slideLoaders').loadSlide
    slideManager.updateSlides()
  })
}

export default slideManager
