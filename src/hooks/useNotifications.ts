import { useEffect, useState } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { doc, setDoc } from 'firebase/firestore';
import { getMessagingInstance } from '../firebase';
import { db } from '../firebase';
import { useStore } from '../store/useStore';

// 🔑 VAPID 키: Firebase Console > 프로젝트 설정 > 클라우드 메시징 > 웹 푸시 인증서
// 지금은 임시 키 — 대표님이 Firebase Console에서 발급 후 교체해 주세요!
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || '';

export function useNotifications() {
    const user = useStore(state => state.user);
    const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
    const [fcmToken, setFcmToken] = useState<string | null>(null);

    // 알림 권한 요청 + FCM 토큰 발급
    const requestPermission = async () => {
        try {
            const permission = await Notification.requestPermission();
            setPermissionStatus(permission);

            if (permission !== 'granted') {
                console.log('[FCM] 알림 권한 거부됨');
                return;
            }

            const messaging = await getMessagingInstance();
            if (!messaging) {
                console.log('[FCM] 이 브라우저는 FCM을 지원하지 않습니다');
                return;
            }

            // FCM 토큰 발급 (VAPID 키 필요)
            if (!VAPID_KEY) {
                console.warn('[FCM] VAPID 키가 없습니다. Firebase Console에서 발급 후 .env에 추가하세요.');
                return;
            }

            const token = await getToken(messaging, {
                vapidKey: VAPID_KEY,
                serviceWorkerRegistration: await navigator.serviceWorker.register('/firebase-messaging-sw.js')
            });

            if (token) {
                console.log('[FCM] 토큰 발급 성공:', token);
                setFcmToken(token);

                // Firestore에 토큰 저장 (서버에서 알림 전송 시 사용)
                if (user?.uid) {
                    await setDoc(
                        doc(db, 'fcmTokens', user.uid),
                        {
                            token,
                            updatedAt: new Date().toISOString(),
                            uid: user.uid
                        },
                        { merge: true }
                    );
                    console.log('[FCM] 토큰 Firestore 저장 완료!');
                }
            }
        } catch (error) {
            console.error('[FCM] 알림 설정 오류:', error);
        }
    };

    // 포그라운드 메시지 수신 (앱이 열려있을 때)
    useEffect(() => {
        let unsubscribe: (() => void) | null = null;

        const setupForegroundListener = async () => {
            const messaging = await getMessagingInstance();
            if (!messaging) return;

            unsubscribe = onMessage(messaging, (payload) => {
                console.log('[FCM] 포그라운드 메시지 수신:', payload);
                // 앱이 열려있을 때는 브라우저 알림 대신 인앱 토스트로 표시
                const title = payload.notification?.title || '🐧 Pipi';
                const body = payload.notification?.body || 'Pipi wants to work out with you!';
                // 브라우저 Notification API로 직접 표시
                if (Notification.permission === 'granted') {
                    new Notification(title, {
                        body,
                        icon: '/pwa-192.png',
                        tag: 'pipi-foreground'
                    });
                }
            });
        };

        setupForegroundListener();
        return () => { if (unsubscribe) unsubscribe(); };
    }, []);

    // 현재 권한 상태 초기 확인
    useEffect(() => {
        if ('Notification' in window) {
            setPermissionStatus(Notification.permission);
        }
    }, []);

    return { permissionStatus, fcmToken, requestPermission };
}
