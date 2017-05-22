import { matchPath } from 'react-router-dom'
import parseId from './parseId'

const overviewPath = { path: '/overview', exact: true, strict: true }
const slidePath = { path: '/:id', exact: true, strict: true }
const presenterPath = { path: '/presenter/:id', exact: true, strict: true }

export const getActiveState = (pathname, maxSlides) => {
  let mode
  let id

  const overviewMatch = matchPath(pathname, overviewPath)
  if (overviewMatch !== null) {
    return { mode: 'overview', path: '/overview' }
  }

  const presenterMatch = matchPath(pathname, presenterPath)
  if (presenterMatch !== null) {
    id = parseId(maxSlides, presenterMatch.params.id)
    mode = 'presenter'
  }

  const slideMatch = matchPath(pathname, slidePath)
  if (slideMatch !== null) {
    id = parseId(maxSlides, slideMatch.params.id)
  }

  if (id === undefined) {
    return undefined
  }

  const path = mode !== undefined ? `/${mode}` : ''

  return { id, mode, path }
}
