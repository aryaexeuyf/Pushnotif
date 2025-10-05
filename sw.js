self.addEventListener('install', e=>self.skipWaiting());
self.addEventListener('activate', e=>console.log('Service Worker aktif'));

self.addEventListener('message', e=>{
  const data = e.data;
  self.registration.showNotification(data.title,{
    body: data.message,
    icon: data.icon || 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Firebase_Logo.svg',
    data: {url: data.url}
  });
});

self.addEventListener('notificationclick', e=>{
  e.notification.close();
  if(e.notification.data?.url){
    clients.openWindow(e.notification.data.url);
  }
});
