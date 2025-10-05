// Konfigurasi
const TELEGRAM_BOT_TOKEN = '7912729716:AAEj-P_f4TNcj_Ze8-HD-Pq3_23wBdeaBvo';
const SERVER_CHECK_URL = 'https://httpbin.org/status/200'; // Ganti dengan endpoint server Anda

// Elemen DOM
const serverIndicator = document.getElementById('server-indicator');
const serverStatus = document.getElementById('server-status');
const firebaseIndicator = document.getElementById('firebase-indicator');
const firebaseStatus = document.getElementById('firebase-status');
const telegramIndicator = document.getElementById('telegram-indicator');
const telegramStatus = document.getElementById('telegram-status');
const notificationIndicator = document.getElementById('notification-indicator');
const notificationStatus = document.getElementById('notification-status');
const requestPermissionBtn = document.getElementById('request-permission');
const testNotificationBtn = document.getElementById('test-notification');
const logEntries = document.getElementById('log-entries');

// Variabel global
let currentFCMToken = null;
let isServiceWorkerRegistered = false;

// Fungsi untuk menambah log
function addLog(message) {
    const now = new Date();
    const timeString = `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}]`;
    
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.innerHTML = `<span class="log-time">${timeString}</span> ${message}`;
    
    logEntries.appendChild(logEntry);
    logEntries.scrollTop = logEntries.scrollHeight;
}

// Fungsi untuk update status
function updateStatus(indicator, statusElement, isOnline, message) {
    if (isOnline) {
        indicator.className = 'status-indicator status-online';
        statusElement.textContent = message || 'Online';
    } else {
        indicator.className = 'status-indicator status-offline';
        statusElement.textContent = message || 'Offline';
    }
}

// Cek status server secara real
async function checkServerStatus() {
    try {
        const response = await fetch(SERVER_CHECK_URL, { 
            method: 'HEAD',
            mode: 'no-cors'
        });
        // Karena no-cors, kita tidak bisa membaca response status
        // Tapi jika tidak error, berarti koneksi berhasil
        updateStatus(serverIndicator, serverStatus, true, 'Server aktif');
        addLog('✓ Server terhubung dengan sukses');
        return true;
    } catch (error) {
        updateStatus(serverIndicator, serverStatus, false, 'Server offline');
        addLog('✗ Gagal terhubung ke server: ' + error.message);
        return false;
    }
}

// Cek status Firebase
async function checkFirebaseStatus() {
    try {
        if (window.firebaseApp) {
            updateStatus(firebaseIndicator, firebaseStatus, true, 'Firebase terhubung');
            addLog('✓ Firebase terhubung dengan sukses');
            
            // Daftarkan Service Worker untuk Firebase Messaging
            await registerServiceWorker();
            
            return true;
        } else {
            throw new Error('Firebase app tidak terinisialisasi');
        }
    } catch (error) {
        updateStatus(firebaseIndicator, firebaseStatus, false, 'Firebase error');
        addLog('✗ Error Firebase: ' + error.message);
        return false;
    }
}

// Daftarkan Service Worker
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            isServiceWorkerRegistered = true;
            addLog('✓ Service Worker terdaftar');
            
            // Setup message listener
            if (window.firebaseMessaging) {
                window.onFirebaseMessage(window.firebaseMessaging, (payload) => {
                    addLog(`📩 Notifikasi diterima: ${payload.notification?.body || 'No body'}`);
                    showNotification(
                        payload.notification?.title || 'Notifikasi Baru',
                        payload.notification?.body || 'Ada pesan baru'
                    );
                });
            }
            
            return registration;
        } catch (error) {
            addLog('✗ Gagal mendaftarkan Service Worker: ' + error.message);
            return null;
        }
    } else {
        addLog('✗ Service Worker tidak didukung browser ini');
        return null;
    }
}

// Cek status Telegram Bot
async function checkTelegramStatus() {
    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`);
        if (response.ok) {
            const data = await response.json();
            if (data.ok) {
                updateStatus(telegramIndicator, telegramStatus, true, `Bot: ${data.result.username}`);
                addLog(`✓ Bot Telegram terhubung: ${data.result.username}`);
                return true;
            }
        }
        throw new Error('Response tidak ok');
    } catch (error) {
        updateStatus(telegramIndicator, telegramStatus, false, 'Bot offline');
        addLog('✗ Gagal terhubung ke Bot Telegram');
        return false;
    }
}

// Cek status izin notifikasi
function checkNotificationPermission() {
    if (Notification.permission === 'granted') {
        updateStatus(notificationIndicator, notificationStatus, true, 'Diizinkan');
        testNotificationBtn.disabled = false;
        return true;
    } else if (Notification.permission === 'denied') {
        updateStatus(notificationIndicator, notificationStatus, false, 'Ditolak');
        testNotificationBtn.disabled = true;
        return false;
    } else {
        updateStatus(notificationIndicator, notificationStatus, false, 'Belum diputuskan');
        testNotificationBtn.disabled = true;
        return false;
    }
}

// Minta izin notifikasi
async function requestNotificationPermission() {
    try {
        const permission = await Notification.requestPermission();
        const isGranted = checkNotificationPermission();
        
        if (permission === 'granted' && isGranted) {
            addLog('✓ Izin notifikasi berhasil diberikan');
            
            // Dapatkan token FCM
            await getFCMToken();
            return true;
        } else {
            addLog('✗ Izin notifikasi ditolak');
            return false;
        }
    } catch (error) {
        addLog('✗ Error meminta izin: ' + error.message);
        return false;
    }
}

// Dapatkan FCM Token
async function getFCMToken() {
    try {
        if (!window.firebaseMessaging) {
            throw new Error('Firebase Messaging tidak tersedia');
        }
        
        // Request permission untuk notifications
        await Notification.requestPermission();
        
        // Dapatkan token
        const token = await window.getFirebaseToken(window.firebaseMessaging, {
            vapidKey: 'BEl62sAh-5Q0bQyzu5RjvvgkH2yfH_MRwQ7pS0VkL7qQ7pS0VkL7qQ7pS0VkL7qQ7pS0VkL7qQ7pS0VkL7qQ' // Ganti dengan VAPID key Anda
        });
        
        if (token) {
            currentFCMToken = token;
            addLog('✓ Token FCM diterima: ' + token.substring(0, 20) + '...');
            
            // Kirim token ke server (dalam implementasi nyata)
            // await sendTokenToServer(token);
            
            return token;
        } else {
            addLog('✗ Tidak ada token FCM yang tersedia');
            return null;
        }
    } catch (error) {
        addLog('✗ Gagal mendapatkan token FCM: ' + error.message);
        return null;
    }
}

// Simpan token ke Firebase Database
async function saveTokenToDatabase(token) {
    try {
        if (!window.firebaseApp) {
            throw new Error('Firebase tidak terinisialisasi');
        }

        // Generate user ID sederhana
        const userId = generateUserId();
        
        // Simpan ke localStorage untuk penggunaan berikutnya
        localStorage.setItem('fcm_user_id', userId);
        localStorage.setItem('fcm_token', token);

        // Simpan ke Firebase Realtime Database
        const databaseURL = 'https://notif-webku-default-rtdb.asia-southeast1.firebasedatabase.app';
        const response = await fetch(`${databaseURL}/tokens/${userId}.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: token,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            })
        });

        if (response.ok) {
            addLog('✓ Token berhasil disimpan ke database');
            return true;
        } else {
            throw new Error('Gagal menyimpan token');
        }
    } catch (error) {
        addLog('✗ Gagal menyimpan token ke database: ' + error.message);
        return false;
    }
}

// Generate simple user ID
function generateUserId() {
    let userId = localStorage.getItem('fcm_user_id');
    if (!userId) {
        userId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('fcm_user_id', userId);
    }
    return userId;
}

// Panggil fungsi saveToken di dalam getFCMToken setelah mendapatkan token:
// Tambahkan di fungsi getFCMToken setelah mendapatkan token:
// if (token) {
//     currentFCMToken = token;
//     addLog('✓ Token FCM diterima: ' + token.substring(0, 20) + '...');
//     await saveTokenToDatabase(token);  // <-- TAMBAH BARIS INI
//     return token;
// }

// Tampilkan notifikasi
function showNotification(title, body) {
    if (Notification.permission === 'granted') {
        const notification = new Notification(title, {
            body: body,
            icon: '/icon.png', // Ganti dengan path ke ikon Anda
            badge: '/badge.png',
            tag: 'telegram-notification',
            requireInteraction: true
        });
        
        notification.onclick = () => {
            window.focus();
            notification.close();
        };
        
        notification.onclose = () => {
            addLog(`📭 Notifikasi ditutup: ${title}`);
        };
        
        addLog(`📤 Notifikasi ditampilkan: ${title}`);
        return notification;
    }
    return null;
}

// Test notifikasi
function testNotification() {
    if (Notification.permission === 'granted') {
        showNotification('Test Notifikasi', 'Ini adalah notifikasi test dari website Anda!');
    } else {
        addLog('✗ Izin notifikasi belum diberikan');
    }
}

// Event Listeners
requestPermissionBtn.addEventListener('click', requestNotificationPermission);
testNotificationBtn.addEventListener('click', testNotification);

// Inisialisasi
document.addEventListener('DOMContentLoaded', async () => {
    addLog('🚀 Sistem dimulai. Memeriksa status...');
    
    // Cek semua status secara berurutan
    await checkServerStatus();
    await checkFirebaseStatus();
    await checkTelegramStatus();
    checkNotificationPermission();
    
    // Setup periodic status check
    setInterval(async () => {
        await checkServerStatus();
        await checkTelegramStatus();
    }, 30000); // Check setiap 30 detik
    
    addLog('✅ Semua sistem siap. Menunggu notifikasi...');
});
