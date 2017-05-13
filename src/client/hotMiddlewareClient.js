import hotMiddleware from 'webpack-hot-middleware/client?overlay=false&reload=true&path=/_extravaganza/hmr'

export const notifyHot = slideManager => {
  hotMiddleware.subscribe(({ action, chunks }) => {
    if (action !== 'changed' || chunks === undefined) {
      return
    }

    const idle = () => {
      slideManager.notifyChanged(chunks)
    }

    const checkIdle = status => {
      if (status === 'idle') {
        module.hot.removeStatusHandler(checkIdle)
        idle()
      }
    }

    module.hot.status(checkIdle)
  })
}
