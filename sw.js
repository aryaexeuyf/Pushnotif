// firebase-messaging-sw.js

importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyBcVJsqtRLkDklZ61XaFrN8LAj7F6eBM80",
  authDomain: "notif-webku.firebaseapp.com",
  databaseURL: "https://notif-webku-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "notif-webku",
  storageBucket: "notif-webku.firebasestorage.app",
  messagingSenderId: "1064332196897",
  appId: "1:1064332196897:web:f8a4423c1a187e8a51f760"
});

const messaging = firebase.messaging();

// iki bakal muncul nek notif dikirim pas browser ditutup / di-minimize
messaging.onBackgroundMessage((payload) => {
  console.log("Pesan background mlebu:", payload);
  const notifTitle = payload.notification.title;
  const notifOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || "/icon.png"
  };
  self.registration.showNotification(notifTitle, notifOptions);
});
