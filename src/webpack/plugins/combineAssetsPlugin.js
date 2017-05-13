import sort from 'alphanum-sort'

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

      compilation.assets[this.output] = {
        source: () => newSource,
        size: () => newSource.length
      }

      const assetsRaw = JSON.stringify(assets)
      compilation.assets['stats.json'] = {
        source: () => assetsRaw,
        size: () => assetsRaw.length
      }

      callback()
    })
  }
}
