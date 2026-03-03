"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPipiMoodAndNotify = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
exports.checkPipiMoodAndNotify = functions.pubsub
    .schedule("every 1 hours")
    .onRun(async (_context) => {
    const db = admin.firestore();
    const now = Date.now();
    const usersSnap = await db.collection("users").get();
    const notifications = [];
    usersSnap.forEach((doc) => {
        const userData = doc.data();
        const penguin = userData.penguin;
        if (!penguin || !penguin.lastInteractionTime)
            return;
        const lastInteraction = new Date(penguin.lastInteractionTime).getTime();
        const hoursElapsed = (now - lastInteraction) / (1000 * 60 * 60);
        let mood = null;
        let title = "";
        let body = "";
        if (hoursElapsed >= 24) {
            mood = "sleeping";
            title = "😴 Pipi가 깊은 잠에 빠졌어요";
            body = "너무 오래 비우셨어요! 피피가 깨어나길 기다리고 있습니다.";
        }
        else if (hoursElapsed >= 8) {
            mood = "hungry";
            title = "😋 Pipi가 배고파요!";
            body = "운동 에너지가 부족합니다. 피피랑 루틴 한 판 어때요?";
        }
        else if (hoursElapsed >= 3) {
            mood = "sad";
            title = "😥 Pipi가 외로워요...";
            body = "오늘 아직 운동 안 하셨나요? 피피가 기다리고 있습니다!";
        }
        if (mood && mood !== penguin.mood) {
            notifications.push(sendPushNotification(doc.id, title, body));
        }
    });
    await Promise.all(notifications);
    return null;
});
async function sendPushNotification(uid, title, body) {
    const db = admin.firestore();
    const tokenDoc = await db.collection("fcmTokens").doc(uid).get();
    if (!tokenDoc.exists)
        return;
    const token = tokenDoc.data()?.token;
    if (!token)
        return;
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
    }
    catch (error) {
        console.error(`Error sending notification to ${uid}:`, error);
    }
}
//# sourceMappingURL=index.js.map