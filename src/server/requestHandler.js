import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { ServerStyleSheet } from 'styled-components'
import RedBox from 'redbox-react'

import InnerApp from '../client/innerApp'
import makePageTemplate, { makeErrorTemplate } from './pageTemplate'

const requestHandler = (req, res, { build, production }) => {
  try {
    const slides = build.getSlides()
    const assetNames = ['manifest.js', 'commons.js']
      .concat(build.getSlideNames(), ['main.js'])

    const sheet = new ServerStyleSheet()
    const app = renderToString(
      sheet.collectStyles(
        <StaticRouter location={req.url} context={{}}>
          <InnerApp slides={slides} />
        </StaticRouter>
      )
    )

    const css = sheet.getStyleTags()
    const html = makePageTemplate(app, css, production ? ['app.js'] : assetNames)

    res.status(200).send(html)
  } catch (err) {
    console.error(err)

    const app = renderToString(<RedBox error={err} />)
    const html = makeErrorTemplate(app)

    res.status(500).send(html)
  }
}

export default requestHandler
