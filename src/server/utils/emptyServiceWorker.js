export default (`
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          return caches.delete(cacheName)
        })
      )
    }).then(function() {
      return self.clients.claim()
    })
  )
})

self.addEventListener('install', function (event) {
  event.waitUntil(self.skipWaiting())
})
`).trim()
