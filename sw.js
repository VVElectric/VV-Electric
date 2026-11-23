// VV Electric service worker — push reception (server sender required).
self.addEventListener('push',event=>{
  let data={};
  try { data=event.data?.json()||{}; } catch { data={body:event.data?.text()||''}; }
  const title=String(data.title||'VV Electric · DEYE');
  const options={body:String(data.body||'Оновлення станції'),icon:'./vv-electric-icon-192.png',badge:'./vv-electric-icon-192.png',tag:String(data.tag||'vv-deye-event'),renotify:true,data:{url:new URL('./index.html',self.registration.scope).href}};
  event.waitUntil(self.registration.showNotification(title,options));
});
self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const url=event.notification.data?.url||self.registration.scope;
  event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(async windows=>{
    for(const client of windows){if(client.url.startsWith(self.registration.scope)){await client.focus();return;}}
    return clients.openWindow(url);
  }));
});
