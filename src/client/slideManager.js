import mitt from 'mitt'
import { matchPath } from 'react-router-dom'
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
        const loader = ensure(slideLoader)
        return { routeName, loader }
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

    return new SlideManager(slideLoaders, slides)
  }

  async notifyChanged(routeNames = []) {
    const { slideLoaders, slides } = this

    const newSlides = await Promise.all(
      slides.map(async (slide, index) => {
        if (!routeNames.includes(slide.routeName)) {
          return slide
        }

        const { loader } = slideLoaders[index]
        const component = (await loader()).default

        return { ...slide, component }
      })
    )

    console.log('[Extravaganza] Updating slides:', routeNames.join(', '))

    this.slides = newSlides
    this.emitter.emit('slides', newSlides)
  }

  subscribe(cb) {
    this.emitter.on('slides', cb)
    cb(this.slides)
    return () => this.emitter.off('slides', cb)
  }
}

export default SlideManager
