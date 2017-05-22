import sort from 'alphanum-sort'

const getSlideChunks = chunks => {
  const slideChunks = chunks.reduce((acc, chunk) => {
    if (chunk.name && chunk.name.startsWith('slides/')) {
      acc[chunk.name] = {
        name: chunk.name,
        ids: chunk.ids
      }
    }

    return acc
  }, {})

  const sortedNames = sort(Object.keys(slideChunks))

  return sortedNames.reduce((acc, key) => {
    acc[key] = slideChunks[key]
    return acc
  }, {})
}

export default getSlideChunks
