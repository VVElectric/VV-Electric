// VV Electric PWA v78. Network-first for app pages; no Supabase/API caching.
const CACHE = 'vv-electric-static-v78';
const SUPABASE_SCRIPT='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.57.4/dist/umd/supabase.min.js';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './vv-electric-icon-192.png', './vv-electric-icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(async () => {try{const c=await caches.open(CACHE);await c.add(new Request(SUPABASE_SCRIPT,{mode:'no-cors'}))}catch(e){console.warn('Offline library cache:',e)}}).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('vv-electric-static-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if(req.method !== 'GET')return;
  if(req.url===SUPABASE_SCRIPT){event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(async res=>{const c=await caches.open(CACHE);await c.put(req,res.clone());return res})));return;}
  if(new URL(req.url).origin !== self.location.origin)return;
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req, {cache:'no-store'}).catch(() => caches.match('./index.html')));
    return;
  }
  event.respondWith(fetch(req).catch(() => caches.match(req)));
});
