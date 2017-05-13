import { readFileSync } from 'fs'

const sanitizeCSS = readFileSync(
  require.resolve('marx-css/css/marx.min.css'),
  { encoding: 'utf8' }
)

const pageBucketScript = `
  <script>
    window.__SLIDE_LOADERS__ = {}
    window.__REGISTER_SLIDE__ = function (routeName, loader) {
      window.__SLIDE_LOADERS__[routeName] = loader
    }
  </script>
`

const pageSlideScripts = slides => slides
  .map(slideRoute => `
    <script type="text/javascript" src="/_extravaganza/webpack/${slideRoute}"></script>
  `)
  .join('')

const makePageTemplate = (app, slides) => `
  <html>
    <head>
      <meta httpequiv="X-UA-Compatible" content="IE=edge,chrome=1" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <title>Extravaganza Slides</title>

      <style type="text/css">
        ${sanitizeCSS}
      </style>
    </head>

    <body>
      <div id="root">${app}</div>

      ${pageBucketScript}
      ${pageSlideScripts(slides)}
    </body>
  </html>
`

export default makePageTemplate
