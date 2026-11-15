const CACHE_NAME = 'rent-ledger-shell-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', event=>{
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache=>cache.addAll(APP_SHELL))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate', event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys
        .filter(key=>key.startsWith('rent-ledger-shell-') && key!==CACHE_NAME)
        .map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch', event=>{
  const request = event.request;
  if(request.method!=='GET') return;

  const url = new URL(request.url);
  if(url.origin!==self.location.origin) return;

  if(request.mode==='navigate'){
    event.respondWith(
      fetch(request).then(async response=>{
        if(response.ok){
          const cache = await caches.open(CACHE_NAME);
          await cache.put(new URL('./index.html', self.location.href), response.clone());
        }
        return response;
      }).catch(()=>caches.match(new URL('./index.html', self.location.href)))
    );
    return;
  }

  event.respondWith(caches.match(request).then(cached=>cached || fetch(request)));
});
