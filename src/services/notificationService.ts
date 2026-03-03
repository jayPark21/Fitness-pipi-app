export const sendLocalNotification = (title: string, body: string) => {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
        new Notification(title, {
            body,
            icon: '/pwa-192.png',
            tag: 'pipi-mood-alert'
        });
    }
};

export const MOOD_MESSAGES = {
    sad: {
        title: "🐧 Pipi가 조금 외로워요...",
        body: "피피랑 같이 운동할 시간이에요! 얼른 들어오세요."
    },
    hungry: {
        title: "🐧 Pipi 배고파요! (운동 부족)",
        body: "피피가 운동 에너지를 기다리고 있어요. 루틴 한 판?"
    },
    sleeping: {
        title: "🐧 Pipi가 깊은 잠에 빠졌어요",
        body: "너무 오래 비우셨나 봐요. 피피를 깨워주세요!"
    }
};
