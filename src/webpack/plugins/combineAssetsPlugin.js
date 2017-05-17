export default class CombineAssetsPlugin {
  constructor (inputFiles = [], outputFile) {
    this.input = inputFiles
    this.output = outputFile
  }

  apply (compiler) {
    compiler.plugin('after-compile', (compilation, callback) => {
      let newSource = ''

      this.input.forEach(name => {
        const asset = compilation.assets[name]
        if (!asset) return

        newSource += `${asset.source()}\n`
        delete compilation.assets[name]
      })

      compilation.assets[this.output] = {
        source: () => newSource,
        size: () => newSource.length
      }

      callback()
    })
  }
}
