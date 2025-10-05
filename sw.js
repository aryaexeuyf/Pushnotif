self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  console.log('Service Worker aktif');
});

self.addEventListener('message', e=>{
  const data = e.data;
  self.registration.showNotification(data.title,{
    body: data.message,
    icon: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Firebase_Logo.svg'
  });
});

self.addEventListener('notificationclick', e=>{
  e.notification.close();
  // bisa tambahin window.open kalo pengen URL redirect
});
