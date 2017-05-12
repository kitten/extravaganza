import hotMiddleware from 'webpack-hot-middleware/client?overlay=false&reload=true&path=/_extravaganza/hmr'

hotMiddleware.subscribe((obj) => {
  console.log('Action', obj)
})
