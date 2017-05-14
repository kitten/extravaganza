if (
  process.env.NODE_ENV === 'production' &&
  typeof window !== 'undefined' &&
  'serviceWorker' in navigator
) {
  navigator.serviceWorker.register('/sw.js', {
    scope: './'
  }).then(reg => {
    reg.onupdatefound = () => {
      const installingWorker = reg.installing

      installingWorker.onstatechange = () => {
        switch (installingWorker.state) {
          case 'installed': {
            if (navigator.serviceWorker.controller) {
              console.log('[SW] New or updated content is available.')
            } else {
              console.log('[SW] Content is now available offline!')
            }

            break
          }

          case 'redundant': {
            console.log('[SW] The installing serviceWorker became redundant.')
            break
          }
        }
      }
    }
  }).catch(err => {
    console.error('[SW] Error during service worker registration:', err)
  })
}
