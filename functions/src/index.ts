import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

/**
 * Scheduled function to check Pipi's mood and send notifications
 * Runs every hour
 */
export const checkPipiMoodAndNotify = functions.pubsub
    .schedule("every 1 hours")
    .onRun(async (_context: functions.EventContext) => {
        const db = admin.firestore();
        const now = Date.now();

        // Get all users
        const usersSnap = await db.collection("users").get();

        const notifications: Promise<any>[] = [];

        usersSnap.forEach((doc: admin.firestore.QueryDocumentSnapshot) => {
            const userData = doc.data();
            const penguin = userData.penguin;
            if (!penguin || !penguin.lastInteractionTime) return;

            const lastInteraction = new Date(penguin.lastInteractionTime).getTime();
            const hoursElapsed = (now - lastInteraction) / (1000 * 60 * 60);

            let mood: string | null = null;
            let title = "";
            let body = "";

            if (hoursElapsed >= 24) {
                mood = "sleeping";
                title = "😴 Pipi가 깊은 잠에 빠졌어요";
                body = "너무 오래 비우셨어요! 피피가 깨어나길 기다리고 있습니다.";
            } else if (hoursElapsed >= 8) {
                mood = "hungry";
                title = "😋 Pipi가 배고파요!";
                body = "운동 에너지가 부족합니다. 피피랑 루틴 한 판 어때요?";
            } else if (hoursElapsed >= 3) {
                mood = "sad";
                title = "😥 Pipi가 외로워요...";
                body = "오늘 아직 운동 안 하셨나요? 피피가 기다리고 있습니다!";
            }

            // If mood changed or needs notification
            if (mood && mood !== penguin.mood) {
                notifications.push(sendPushNotification(doc.id, title, body));
            }
        });

        await Promise.all(notifications);
        return null;
    });

async function sendPushNotification(uid: string, title: string, body: string) {
    const db = admin.firestore();
    const tokenDoc = await db.collection("fcmTokens").doc(uid).get();

    if (!tokenDoc.exists) return;
    const token = tokenDoc.data()?.token;
    if (!token) return;

    const message = {
        notification: { title, body },
        token: token,
        webpush: {
            fcmOptions: {
                link: "https://fitness-penguin-app.web.app/dashboard"
            }
        }
    };

    try {
        await admin.messaging().send(message);
        console.log(`Notification sent to user ${uid}`);
    } catch (error) {
        console.error(`Error sending notification to ${uid}:`, error);
    }
}
