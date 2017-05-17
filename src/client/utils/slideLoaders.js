import sort from 'alphanum-sort'

const loadSlide = name => import(`${__SLIDES_FOLDER__}/` + name + '.js')
export const slideNames = sort(__SLIDES__.map(x => x.slice(0, -3)))
export const slideLoaders = slideNames.map(slide => () => loadSlide(slide))
