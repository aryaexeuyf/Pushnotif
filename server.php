<?php
// server.php - Simple PHP backend untuk Telegram Bot
$telegram_token = '7912729716:AAEj-P_f4TNcj_Ze8-HD-Pq3_23wBdeaBvo';
$firebase_url = 'https://notif-webku-default-rtdb.asia-southeast1.firebasedatabase.app';

// Handle Telegram Webhook
$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['message']['text'])) {
    $chat_id = $input['message']['chat']['id'];
    $text = $input['message']['text'];
    
    // Handle command /set
    if (strpos($text, '/set ') === 0) {
        $message = substr($text, 5); // Ambil pesan setelah "/set "
        
        // Kirim notifikasi ke semua user yang terdaftar
        sendPushNotification($message);
        
        // Kirim balasan ke Telegram
        sendTelegramMessage($chat_id, "Notifikasi terkirim: " . $message);
    }
}

function sendPushNotification($message) {
    global $firebase_url;
    
    // Ambil semua tokens dari Firebase
    $tokens_response = file_get_contents($firebase_url . '/tokens.json');
    $tokens = json_decode($tokens_response, true);
    
    if ($tokens) {
        foreach ($tokens as $userId => $userData) {
            if (isset($userData['token'])) {
                // Kirim push notification ke setiap device
                sendFCMMessage($userData['token'], $message);
            }
        }
    }
}

function sendFCMMessage($token, $message) {
    $server_key = 'YOUR_FIREBASE_SERVER_KEY'; // Dapatkan dari Firebase Console → Project Settings → Cloud Messaging
    
    $data = [
        'to' => $token,
        'notification' => [
            'title' => 'Notifikasi dari Telegram',
            'body' => $message,
            'icon' => '/icon.png',
            'click_action' => 'https://yourwebsite.com'
        ]
    ];
    
    $options = [
        'http' => [
            'method' => 'POST',
            'header' => 
                "Content-Type: application/json\r\n" .
                "Authorization: key=" . $server_key . "\r\n",
            'content' => json_encode($data)
        ]
    ];
    
    $context = stream_context_create($options);
    file_get_contents('https://fcm.googleapis.com/fcm/send', false, $context);
}

function sendTelegramMessage($chat_id, $message) {
    global $telegram_token;
    
    $url = "https://api.telegram.org/bot{$telegram_token}/sendMessage";
    $data = [
        'chat_id' => $chat_id,
        'text' => $message
    ];
    
    $options = [
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/json\r\n",
            'content' => json_encode($data)
        ]
    ];
    
    $context = stream_context_create($options);
    file_get_contents($url, false, $context);
}
?>
