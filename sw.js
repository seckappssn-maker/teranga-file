// Teranga File : notifications « c'est votre tour » même quand le téléphone est fermé
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Teranga File', {
    body: d.body || '', tag: d.tag || 'file', renotify: true, requireInteraction: true,
    vibrate: [500, 200, 500, 200, 800], icon: './apple-touch-icon.png', badge: './icon-192.png',
    data: { url: d.url || './' }
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const t = (url.match(/[?&]t=(\d+)/) || [])[1];
    for (const w of wins) if (t && w.url.indexOf('t=' + t) >= 0) { await w.focus(); return; }
    await self.clients.openWindow(url);
  })());
});
