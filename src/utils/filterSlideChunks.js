const filterSlideChunks = chunks =>
  chunks.filter(name => name && name.startsWith('slides/'))

export default filterSlideChunks
