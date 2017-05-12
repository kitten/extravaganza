import React from 'react'
import { matchPath } from 'react-router-dom'
import Loadable from 'react-loadable'

import Loading from './loading'

const ensure = slideLoader => () => new Promise(resolve => slideLoader(resolve))

const routeMatchesIndex = index => matchPath(
  window.location.pathname, {
    path: `/${index}`,
    exact: true,
    strict: false
  }
) !== undefined

const makeLoadables = async slides => {
  const loadables = Object
    .keys(slides)
    .map(async (routeName, index) => {
      const { slideLoader, chunkId } = slides[routeName]()
      const loader = ensure(slideLoader)
      if (routeMatchesIndex(index)) {
        await loader()
      }

      const component = Loadable({
        loader,
        webpackRequireWeakId: () => chunkId,
        resolveModule: module => module.default,
        LoadingComponent: Loading,
        delay: 200
      })

      return {
        component,
        routeName,
        index
      }
    })

  return await Promise.all(loadables)
}

export default makeLoadables
