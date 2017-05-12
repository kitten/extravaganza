import { readFileSync } from 'fs'

const sanitizeCSS = readFileSync(
  require.resolve('sanitize.css/sanitize.css'),
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

      <script type="text/javascript" src="/_extravaganza/webpack/manifest.js"></script>
      <script type="text/javascript" src="/_extravaganza/webpack/commons.js"></script>

      ${pageBucketScript}
      ${pageSlideScripts(slides)}

      <script type="text/javascript" src="/_extravaganza/webpack/main.js"></script>
    </body>
  </html>
`

export default makePageTemplate
