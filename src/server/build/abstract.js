import { createElement } from 'react'

import { getBuildFolder } from '../../user/config'
import resolvePaths from '../../utils/resolvePaths'

class Build {
  constructor(production = false) {
    this.production = production
  }

  getSlideNames() {
    return this.slides.map(x => x.replace('slides/', ''))
  }

  getSlideAssets() {
    return this.slideAssetIds.map(id => `chunk/${id}.js`)
  }

  getSlides() {
    return this.slides.map(routeName => {
      const requirePath = resolvePaths(
        getBuildFolder(this.production),
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

export default Build
