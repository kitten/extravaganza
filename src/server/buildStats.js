import { createElement } from 'react'
import sort from 'alphanum-sort'

import { getBuildFolder } from '../user/config'
import resolvePaths from '../utils/resolvePaths'
import filterSlideChunks from '../utils/filterSlideChunks'

class BuildStats {
  constructor() {
    const requirePath = resolvePaths(getBuildFolder(true), 'stats.json')
    this.stats = require(requirePath)
  }

  getChunks() {
    return this.stats
  }

  getSlideNames() {
    return sort(filterSlideChunks(this.getChunks()))
  }

  getSlides() {
    return this.getSlideNames()
      .map(routeName => {
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
