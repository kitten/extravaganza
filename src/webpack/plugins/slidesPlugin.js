import sort from 'alphanum-sort'

import getSlideChunks from '../utils/getSlideChunks'

class SuppressEntryChunksPlugin {
  constructor() {
    this.skip = /^slides\//
  }

  apply(compiler) {
    compiler.plugin('after-compile', (compilation, callback) => {
      compilation.chunks.forEach(chunk => {
        if (chunk.name && this.skip.test(chunk.name)) {
          // Remove all suppressed slide entrypoints from result
          chunk.files.forEach(file => {
            delete compilation.assets[file]
          })
        }
      })

      const slideChunks = getSlideChunks(compilation.chunks)
      const slides = Object.keys(slideChunks)
      const slideAssetIds = slides.map(key => slideChunks[key].ids[1])
      const slidesJSON = JSON.stringify({ slides, slideAssetIds })

      compilation.assets['assets.json'] = {
        source: () => slidesJSON,
        size: () => slidesJSON.length
      }

      callback()
    })
  }
}

export default SuppressEntryChunksPlugin
