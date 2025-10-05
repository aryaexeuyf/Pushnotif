// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcVJsqtRLkDklZ61XaFrN8LAj7F6eBM80",
  authDomain: "notif-webku.firebaseapp.com",
  databaseURL: "https://notif-webku-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "notif-webku",
  storageBucket: "notif-webku.firebasestorage.app",
  messagingSenderId: "1064332196897",
  appId: "1:1064332196897:web:f8a4423c1a187e8a51f760"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get reference to the service
const messaging = getMessaging(app);

// Export untuk digunakan di file lain
window.firebaseApp = app;
window.firebaseMessaging = messaging;
window.getFirebaseToken = getToken;
window.onFirebaseMessage = onMessage;
