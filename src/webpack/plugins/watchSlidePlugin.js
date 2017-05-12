class WatchSlidePlugin {
  constructor(dir) {
    this.dir = dir
  }

  apply (compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      compilation.contextDependencies = [
        ...compilation.contextDependencies,
        this.dir
      ]

      callback()
    })
  }
}

export default WatchSlidePlugin
