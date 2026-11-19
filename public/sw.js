const cacheName = 'ielts-discipline-os-v1'
const base = new URL(self.registration.scope)

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const response = await fetch(base, { cache: 'reload' })
    if (!response.ok) throw new Error('App shell unavailable')
    const html = await response.clone().text()
    const assets = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
      .map(([, path]) => new URL(path, base))
      .filter(url => url.origin === base.origin && url.pathname.startsWith(base.pathname))
    const cache = await caches.open(cacheName)
    await cache.addAll([...assets.map(url => url.href), new URL('icon-192.png', base).href, new URL('icon-512.png', base).href])
    await cache.put(base, response)
  })())
})

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    await Promise.all((await caches.keys()).filter(key => key.startsWith('ielts-discipline-os-') && key !== cacheName).map(key => caches.delete(key)))
    await self.clients.claim()
  })())
})

self.addEventListener('fetch', event => {
  const request = event.request
  const url = new URL(request.url)
  if (request.method !== 'GET' || url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) return
  event.respondWith((async () => {
    const cache = await caches.open(cacheName)
    if (request.mode === 'navigate') {
      try {
        const response = await fetch(request)
        if (response.ok) await cache.put(base, response.clone())
        return response
      } catch {
        return await cache.match(base) ?? Response.error()
      }
    }
    const cached = await cache.match(request)
    if (cached) return cached
    const response = await fetch(request)
    if (response.ok) await cache.put(request, response.clone())
    return response
  })())
})
