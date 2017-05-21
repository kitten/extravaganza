const parseId = (size, matchedStr) => {
  const id = parseInt(matchedStr, 10)

  if (id < 0 || id >= size || id !== id) {
    return undefined
  }

  return id
}

export default parseId
