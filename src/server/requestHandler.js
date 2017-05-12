import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'

import App from '../client/app'
import makePageTemplate from './pageTemplate'

const requestHandler = (req, res, hotReloading) => {
  const slideNames = hotReloading.getSlideNames()
  const slides = hotReloading.getSlides()

  const app = renderToString(
    <StaticRouter location={req.url} context={{}}>
      <App slides={slides} />
    </StaticRouter>
  )

  const html = makePageTemplate(app, slideNames)

  res.status(200).send(html)
}

export default requestHandler
