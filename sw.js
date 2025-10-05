self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://google.com') // ubah dadi link GitHub Pages-mu
  );
});
