import React from 'react'
import Loadable from 'react-loadable'

import Loading from './loading'

const ensure = slideLoader => new Promise(resolve => slideLoader(resolve))

const makeLoadables = slides => Object
  .keys(slides)
  .map((routeName, index) => {
    const slideLoader = slides[routeName]()

    const component = Loadable({
      loader: () => ensure(slideLoader),
      LoadingComponent: Loading,
      delay: 200
    })

    return {
      component,
      routeName,
      index
    }
  })

export default makeLoadables
