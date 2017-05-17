import { createElement } from 'react'

import { getBuildFolder } from '../user/config'
import resolvePaths from '../utils/resolvePaths'

class BuildStats {
  constructor() {
    const requirePath = resolvePaths(getBuildFolder(true), 'assets.json')
    this.slides = require(requirePath)
  }

  getSlideNames() {
    return this.slides.map(x => x.replace('slides/', ''))
  }

  getSlides() {
    return this.slides.map(routeName => {
      const requirePath = resolvePaths(getBuildFolder(true), `dist/${routeName}`)
      const component = () => {
        const WrappedComponent = require(requirePath).default
        return createElement(WrappedComponent)
      }

      return {
        component,
        routeName
      }
    })
  }
}

export default BuildStats
