export default class SaveSlidesMetaPlugin {
  constructor (slides = []) {
    this.slides = slides
  }

  apply (compiler) {
    compiler.plugin('after-compile', (compilation, callback) => {
      const json = JSON.stringify(this.slides)

      /*
      compilation.assets['assets.json'] = {
        source: () => json,
        size: () => json.length
      }
      */

      callback()
    })
  }
}
