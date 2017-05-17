class SuppressEntryChunksPlugin {
  constructor(entryChunks = []) {
    this.skip = entryChunks
  }

  apply (compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      compilation.chunks.forEach(chunk => {
        if (this.skip.includes(chunk.name)) {
          chunk.files.forEach(file => {
            delete compilation.assets[file]
          })
        }
      })

      callback()
    })
  }
}

export default SuppressEntryChunksPlugin
