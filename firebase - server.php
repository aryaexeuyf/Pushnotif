<?php
// firebase-server.php - SERVER LENGKAP DENGAN FCM v1
$telegram_token = '7912729716:AAEj-P_f4TNcj_Ze8-HD-Pq3_23wBdeaBvo';
$firebase_url = 'https://notif-webku-default-rtdb.asia-southeast1.firebasedatabase.app';

// SERVICE ACCOUNT KEY - SIMPAN SEBAGAI service-account.json
$service_account_key = [
    "type" => "service_account",
    "project_id" => "notif-webku",
    "private_key_id" => "dc676693ce61f1f3e9af33e55c1cca5531a1d283",
    "private_key" => "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC5HNODl8h4Z53r\ndhaU3Yj0YefZmu+1eMz70peeJX3wvS+DMkH6v3lWp2kT0vDGI6VKdbbmo1Nvmleh\ny9o9pne3/59PSFthr0EmVLIablcEP5u5t6jyNQXXe+bK/Rpth6lSRE188gpri/VB\napi/Q1euAllfv8V2SjhWY6hg67/RUmwfxpgfoAO4WEz4qiAVsr4JJ93o1rxGk+cT\nkuinqRn6c8Ve4VVfGWIk5xLIQTpEGL4rnj1c9nnPH7+TX5YgTK9w8RAlF73jtzJr\nHcEb+rK2KGPRh+DqJ7NbAE6tDBGity4Wlxxgqr7Asg+KMHfm4nYB7WXQ8PFFYh0h\nuEjm4c8xAgMBAAECggEAAnJINNVjEb1L095vCLdfTZyEIgb3S0qOCfdz58QG1LFJ\nYRZfUxsn9T5X6ApKApJaxz/EQ6rNqdxMM3AUYatzKlg7YKK8C2/ToHgu1OTXq0+U\nZSlRVycefUUuzQi4ilFISnUq4X945gg23O8V1vRCwsLW78oi58/uC+07/tDqy29B\nuJOuxeqe/SxGNFxc9+aBuSvp9yIUu7cMCDRdbcltPo+lSSGYjvKQCcMPh/GqVtyd\n9I+taVXjl5qym9lyE/YIGrKQPbXy4UBLFr/5AfFCxYQ4o36Ed0c2E3G/dO6sxPxU\n5zYqyE2z3SqtKAQhQEoueosFZOADeS1xDv7NjLDxwQKBgQD/za2O3JlB5+13RTVV\n93gmtTjBT4T6Kw7VNUiTIZao8uXmdSOZjI6+XfMcq5HY3IS+Gp1JWDt50rO+gQ6/\nAZVJ1rJp80XVkXrh4qYW0TJqUwVwhZ5XuQaY9ztA3Gil98tvFapWcy9nVu224TtD\nqD89p+BfKNL5XGbNUdL+M/EqYQKBgQC5QT3qdNL8i6gXPZPy3Z4M8t9xadRwetT8\nN6gZ2QWcqqFQEjtxQJGEF508a1KGYTMIn0f4x919+XRT9v8Zk6fSv2ZibZ3cSqW7\ner4CLNm7ZIFzI/bZKrjiVVbDDnv579UhhrkfyheAF7KXMJ0LoKz37NaMixrMhAhu\niHIeCGX20QKBgQDcV8rceGD7SFBgoJjkyBoTHZ8ZxOmCpHxOY2t0cUZZmYE3Fkfo\nCA8dI8g6Nf+Xkbw2FK7PctUohrqVqo2NMkvqIqnkYc0RvhLfaGAw31pSA9l3p2FR\nputr7+p2YGU0MVJnCX6EoQuANHznPvPRv6dZ8LVwwrWYXmOfEJByr0NZgQKBgQCU\ngemZnydYDrikUNfelKxT4wsehuEnfkBpJFDcz64BBoQkhUkjo8hDZQ7GVZ6lXRwl\nKFLw63/ysdwAR3v+y/B4MLlp5EftReYQIfhaFAxDffGMFOOY+feWcSUJXv4hwZJQ\nuwiCpGYsaFLhgrYSkS633SOtLQJBuwJrYXRiAQeEUQKBgQDcqau1yOPNw3SehaZ4\n2aUb1iH8uHX/HZ2BlzxbXpBpnJq3B66U/lEStUBfwAtZPwmuQBHxYbVisMtNwvz3\nrGbPB97+qku+JMAtP30cb+Grc41C0Fx6zITgsrnyxKSqeazSdWVx1nCjMlu9hjA1\nroUVAWPwxmAfoGh4aJhHToMSJA==\n-----END PRIVATE KEY-----\n",
    "client_email" => "notif-webku@appspot.gserviceaccount.com",
    "client_id" => "112368449792380083934",
    "auth_uri" => "https://accounts.google.com/o/oauth2/auth",
    "token_uri" => "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url" => "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url" => "https://www.googleapis.com/robot/v1/metadata/x509/notif-webku%40appspot.gserviceaccount.com"
];

// Dapatkan Access Token untuk FCM v1
function getAccessToken($service_account) {
    $now = time();
    $payload = [
        'iss' => $service_account['client_email'],
        'scope' => 'https://www.googleapis.com/auth/firebase.messaging',
        'aud' => $service_account['token_uri'],
        'iat' => $now,
        'exp' => $now + 3600
    ];
    
    $header = ['alg' => 'RS256', 'typ' => 'JWT'];
    $segments = [
        base64_encode(json_encode($header)),
        base64_encode(json_encode($payload))
    ];
    
    $signing_input = implode('.', $segments);
    
    // Sign dengan private key
    $private_key = $service_account['private_key'];
    openssl_sign($signing_input, $signature, $private_key, 'SHA256');
    $segments[] = base64_encode($signature);
    
    $jwt = implode('.', $segments);
    
    // Request access token
    $response = file_get_contents($service_account['token_uri'], false, stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => 'Content-Type: application/x-www-form-urlencoded',
            'content' => 'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=' . $jwt
        ]
    ]));
    
    $data = json_decode($response, true);
    return $data['access_token'] ?? null;
}

// Handle Telegram Webhook
$input = json_decode(file_get_contents('php://input'), true);

if(isset($input['message']['text'])) {
    $chat_id = $input['message']['chat']['id'];
    $text = $input['message']['text'];
    $from_name = $input['message']['from']['first_name'] ?? 'User';
    
    // Log pesan
    file_put_contents('telegram_log.txt', date('Y-m-d H:i:s') . " - $from_name: $text\n", FILE_APPEND);
    
    if(strpos($text, '/set ') === 0) {
        $message = trim(substr($text, 5));
        
        if(empty($message)) {
            sendTelegramMessage($chat_id, "❌ Pesan kosong! Kirim: /set [pesan]");
            exit;
        }
        
        // Kirim notifikasi push ke semua device
        $result = sendPushNotification($message, $service_account_key);
        
        if($result['success'] > 0) {
            sendTelegramMessage($chat_id, "✅ Notifikasi terkirim ke {$result['success']} device!\n\nPesan: \"$message\"");
            
            // Simpan history
            saveMessageHistory($message, $from_name, $result['success']);
        } else {
            sendTelegramMessage($chat_id, "❌ Gagal mengirim notifikasi. Tidak ada device terdaftar.\n\nPesan: \"$message\"");
        }
    }
    
    elseif($text == '/start') {
        sendTelegramMessage($chat_id, "🤖 <b>BOT NOTIFIKASI AKTIF!</b>\n\nKirim perintah:\n<code>/set [pesan]</code>\n\nContoh:\n<code>/set halo dek</code>\n<code>/set meeting jam 3</code>\n\nNotifikasi akan muncul di website meski browser ditutup! 🔔");
    }
    
    elseif($text == '/status') {
        $stats = getStats();
        sendTelegramMessage($chat_id, "📊 <b>STATUS SISTEM</b>\n\nDevice Terdaftar: <b>{$stats['device_count']}</b>\nNotifikasi Terkirim: <b>{$stats['message_count']}</b>\nServer: <b>✅ AKTIF</b>");
    }
    
    elseif($text == '/help') {
        sendTelegramMessage($chat_id, "📖 <b>BANTUAN</b>\n\n<code>/start</code> - Memulai bot\n<code>/set [pesan]</code> - Kirim notifikasi\n<code>/status</code> - Status sistem\n<code>/help</code> - Bantuan ini\n\n<b>Contoh:</b>\n<code>/set halo semua!</code>\n<code>/set jangan lupa meeting</code>");
    }
}

// Kirim push notification ke semua device
function sendPushNotification($message, $service_account) {
    global $firebase_url;
    
    // Ambil access token
    $access_token = getAccessToken($service_account);
    if(!$access_token) {
        return ['success' => 0, 'error' => 'Gagal mendapatkan access token'];
    }
    
    // Ambil semua tokens dari Firebase
    $tokens_response = file_get_contents($firebase_url . '/tokens.json');
    $tokens = json_decode($tokens_response, true);
    
    $success_count = 0;
    $errors = [];
    
    if($tokens) {
        foreach($tokens as $userId => $userData) {
            if(isset($userData['token'])) {
                $token = $userData['token'];
                
                // Kirim notifikasi ke device
                $result = sendFCMessage($token, $message, $access_token);
                if($result) {
                    $success_count++;
                } else {
                    $errors[] = $userId;
                }
                
                // Delay kecil antar request
                usleep(100000); // 0.1 detik
            }
        }
    }
    
    return ['success' => $success_count, 'errors' => $errors];
}

// Kirim single FCM message
function sendFCMessage($token, $message, $access_token) {
    $data = [
        'message' => [
            'token' => $token,
            'notification' => [
                'title' => '📱 Notifikasi Baru',
                'body' => $message
            ],
            'webpush' => [
                'headers' => [
                    'Urgency' => 'high'
                ],
                'notification' => [
                    'icon' => 'https://yourwebsite.com/icon.png',
                    'badge' => 'https://yourwebsite.com/badge.png',
                    'vibrate' => [100, 50, 100]
                ]
            ],
            'data' => [
                'type' => 'telegram_message',
                'message' => $message,
                'timestamp' => time(),
                'click_action' => 'https://yourwebsite.com'
            ]
        ]
    ];
    
    $options = [
        'http' => [
            'method' => 'POST',
            'header' => 
                "Content-Type: application/json\r\n" .
                "Authorization: Bearer " . $access_token . "\r\n",
            'content' => json_encode($data),
            'timeout' => 10
        ]
    ];
    
    $context = stream_context_create($options);
    $result = @file_get_contents('https://fcm.googleapis.com/v1/projects/notif-webku/messages:send', false, $context);
    
    return $result !== false;
}

// Simpan history pesan
function saveMessageHistory($message, $from_name, $device_count) {
    global $firebase_url;
    
    $history_data = [
        'message' => $message,
        'from' => $from_name,
        'device_count' => $device_count,
        'timestamp' => time()
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $firebase_url . '/message_history.json');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($history_data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_exec($ch);
    curl_close($ch);
}

// Dapatkan statistik
function getStats() {
    global $firebase_url;
    
    $tokens = file_get_contents($firebase_url . '/tokens.json');
    $tokens_data = json_decode($tokens, true);
    $device_count = $tokens_data ? count($tokens_data) : 0;
    
    $history = file_get_contents($firebase_url . '/message_history.json');
    $history_data = json_decode($history, true);
    $message_count = $history_data ? count($history_data) : 0;
    
    return [
        'device_count' => $device_count,
        'message_count' => $message_count
    ];
}

// Kirim pesan ke Telegram
function sendTelegramMessage($chat_id, $text) {
    global $telegram_token;
    
    $url = "https://api.telegram.org/bot$telegram_token/sendMessage";
    $data = [
        'chat_id' => $chat_id,
        'text' => $text,
        'parse_mode' => 'HTML'
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_exec($ch);
    curl_close($ch);
}

// Test endpoint
if($_SERVER['REQUEST_METHOD'] == 'GET') {
    if(isset($_GET['test'])) {
        echo "✅ FIREBASE SERVER AKTIF!\n";
        echo "🤖 Telegram Bot: Ready\n";
        echo "🔥 Firebase Project: notif-webku\n";
        echo "📱 Service Account: " . $service_account_key['client_email'] . "\n";
        
        // Test FCM
        $token = getAccessToken($service_account_key);
        if($token) {
            echo "🔑 FCM Access Token: OK\n";
        } else {
            echo "❌ FCM Access Token: FAILED\n";
        }
    }
    
    if(isset($_GET['stats'])) {
        $stats = getStats();
        echo json_encode($stats, JSON_PRETTY_PRINT);
    }
}

echo "OK";
?>
