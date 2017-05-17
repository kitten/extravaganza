export const loadSlide = name => {
  const routeName = name.slice(0, -3)
  return import(`${__SLIDES_FOLDER__}/` + routeName + '.js')
}
