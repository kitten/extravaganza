import sort from 'alphanum-sort'

import findSlides from '../utils/findSlides'

class SuppressEntryChunksPlugin {
  constructor() {
    this.skip = /^slides\//
  }

  apply (compiler) {
    compiler.plugin('after-compile', (compilation, callback) => {
      compilation.chunks.forEach(chunk => {
        if (chunk.name && this.skip.test(chunk.name)) {
          // Remove all suppressed slide entrypoints from result
          chunk.files.forEach(file => {
            delete compilation.assets[file]
          })
        }
      })

      findSlides().then(slides => {
        const slidesJSON = JSON.stringify(sort(slides))

        compilation.assets['assets.json'] = {
          source: () => slidesJSON,
          size: () => slidesJSON.length
        }

        callback()
      })
    })
  }
}

export default SuppressEntryChunksPlugin
