import React from 'react'
import { render } from 'rapscallion'
import { StaticRouter } from 'react-router-dom'

import App from '../client/app'
import makePageTemplate from './pageTemplate'

const requestHandler = (req, res, hotReloading) => {
  const slideNames = hotReloading.getSlideNames()
  const slides = hotReloading.getSlides()

  const app = render(
    <StaticRouter location={req.url} context={{}}>
      <App slides={slides} />
    </StaticRouter>
  )

  // Disable checksums
  app.includeDataReactAttrs(false)

  const document = makePageTemplate(app, slideNames)

  return document
    .toPromise()
    .then(html => {
      res.status(200).send(html)
    })
}

export default requestHandler
