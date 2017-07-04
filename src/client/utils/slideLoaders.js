const slidePromiseCache = {}

export const loadSlide = name => {
  const routeName = name.slice(0, -3)

  if (slidePromiseCache[routeName]) {
    return slidePromiseCache[routeName]
  }

  return (slidePromiseCache[routeName] = import(
    `${__SLIDES_FOLDER__}/` + routeName + '.js'
  ))
}
