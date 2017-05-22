import { createElement } from 'react'

import { getBuildFolder } from '../user/config'
import resolvePaths from '../utils/resolvePaths'

class BuildStats {
  constructor() {
    const requirePath = resolvePaths(getBuildFolder(true), 'assets.json')
    const { slides, slideAssetIds } = require(requirePath)

    this.slides = slides
    this.slideAssetIds = slideAssetIds
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
        getBuildFolder(true),
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

export default BuildStats
