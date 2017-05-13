import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'

import { InnerApp } from '../client/app'
import makePageTemplate from './pageTemplate'

const requestHandler = (req, res, { build, production }) => {
  const slides = build.getSlides()
  const assetNames = ['manifest.js', 'commons.js']
    .concat(build.getSlideNames(), ['main.js'])

  const app = renderToString(
    <StaticRouter location={req.url} context={{}}>
      <InnerApp slides={slides} />
    </StaticRouter>
  )

  const html = makePageTemplate(app, production ? ['app.js'] : assetNames)

  res.status(200).send(html)
}

export default requestHandler
