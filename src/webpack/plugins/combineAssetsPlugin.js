import sort from 'alphanum-sort'
import { minify } from 'uglify-js'

export default class CombineAssetsPlugin {
  constructor ({ outputFile, statsFile }) {
    this.output = outputFile
    this.stats = statsFile
  }

  apply (compiler) {
    compiler.plugin('after-compile', (compilation, callback) => {
      const slides = sort(
        Object
          .keys(compilation.assets)
          .filter(name => name.startsWith('slides/'))
      )

      const assets = ['manifest.js', 'commons.js'].concat(slides, 'main.js')

      let newSource = ''
      assets.forEach((name) => {
        const asset = compilation.assets[name]
        if (!asset) return

        newSource += `${asset.source()}\n`
        delete compilation.assets[name]
      })

      const minified = minify(newSource, {
        warnings: false
      })

      compilation.assets[this.output] = {
        source: () => minified.code,
        size: () => minified.code.length
      }

      const assetsRaw = JSON.stringify(assets)
      compilation.assets['assets.json'] = {
        source: () => assetsRaw,
        size: () => assetsRaw.length
      }

      callback()
    })
  }
}
