import { matchPath } from 'react-router-dom'
import parseId from './parseId'

const slidePath = { path: '/:id', exact: true, strict: true }
const presenterPath = { path: '/presenter/:id', exact: true, strict: true }

export const getActiveState = maxSlides => {
  const { pathname } = window.location
  const presenterMatch = matchPath(pathname, presenterPath)

  let mode
  let id

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

export const getActiveSlideId = maxSlides => {
  const state = getActiveState(maxSlides)

  return state === undefined ? undefined : state.id
}
