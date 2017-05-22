import Build from './abstract'
import { getBuildFolder } from '../../user/config'
import resolvePaths from '../../utils/resolvePaths'

class BuildStats extends Build {
  constructor() {
    super(true)

    const requirePath = resolvePaths(getBuildFolder(true), 'assets.json')
    const { slides, slideAssetIds } = require(requirePath)

    this.slides = slides
    this.slideAssetIds = slideAssetIds
  }
}

export default BuildStats
