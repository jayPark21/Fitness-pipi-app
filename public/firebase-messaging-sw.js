// Firebase Messaging Service Worker
// 백그라운드 상태에서 푸시 알림을 수신하는 서비스 워커입니다.
importScripts('https://www.gstatic.com/firebasejs/12.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDbUI0K8Y6k9H6Ugp4PpmS9sgTZZpcrwlI",
    authDomain: "fitness-penguin-app.firebaseapp.com",
    projectId: "fitness-penguin-app",
    storageBucket: "fitness-penguin-app.firebasestorage.app",
    messagingSenderId: "818086618024",
    appId: "1:818086618024:web:cf0e020535bab7685ab39d"
});

const messaging = firebase.messaging();

// 백그라운드 메시지 수신 처리
messaging.onBackgroundMessage((payload) => {
    console.log('[FCM SW] 백그라운드 메시지 수신:', payload);

    const notificationTitle = payload.notification?.title || '🐧 Pipi가 기다리고 있어요!';
    const notificationOptions = {
        body: payload.notification?.body || 'Pipi missed you today! Come back and train together! 💪',
        icon: '/pwa-192.png',
        badge: '/pwa-192.png',
        tag: 'pipi-reminder',
        renotify: true,
        requireInteraction: false,
        data: { url: '/dashboard' }
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// 알림 클릭 → 앱으로 이동
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const targetUrl = event.notification.data?.url || '/dashboard';
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            for (const client of clientList) {
                if (client.url.includes(targetUrl) && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
