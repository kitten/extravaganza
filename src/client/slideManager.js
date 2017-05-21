import mitt from 'mitt'
import Loadable from 'react-loadable'

import history from './history'
import { getActiveState, getActiveSlideId } from './utils/currentSlide'
import { loadSlide } from './utils/slideLoaders'
import Loading from './components/loading'

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

    const activeSlideId = getActiveSlideId(slideNames.length)

    return Promise.all(
      slideNames.map(async (routeName, index) => {
        const loader = () => this.loadSlide(routeName)

        const component = preloadFirst && activeSlideId === index
          ? (await loader()).default
          : Loadable({
              loader,
              resolveModule: module => module.default,
              LoadingComponent: Loading,
              delay: 200
            })

        return component
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

  gotoNext() {
    const { id, path } = getActiveState(this.slides.length)
    const nextId = id === undefined ? 0 : id + 1

    if (nextId < this.slides.length) {
      history.push(`${path}/${nextId}`)
      this.preload(nextId + 1)
      storeState(nextId)
    }
  }

  gotoPrev() {
    const { id, path } = getActiveState(this.slides.length)
    const nextId = id === undefined ? 0 : id - 1

    if (nextId >= 0) {
      history.push(`${path}/${nextId}`)
      this.preload(nextId - 1)
      storeState(nextId)
    }
  }

  updateState({ key, newValue }) {
    if (key === LOCALSTORAGE_KEY) {
      const { slide } = JSON.parse(newValue)
      const { id, path } = getActiveState(this.slides.length)

      if (
        typeof slide === 'number' &&
        slide >= 0 &&
        slide < this.slides.length &&
        slide !== id
      ) {
        history.push(`${path}/${slide}`)
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
