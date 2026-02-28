import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyDbUI0K8Y6k9H6Ugp4PpmS9sgTZZpcrwlI",
    authDomain: "fitness-penguin-app.firebaseapp.com",
    projectId: "fitness-penguin-app",
    storageBucket: "fitness-penguin-app.firebasestorage.app",
    messagingSenderId: "818086618024",
    appId: "1:818086618024:web:cf0e020535bab7685ab39d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// FCM은 서비스 워커가 지원될 때만 초기화 (Safari 등 미지원 브라우저 대비)
export const getMessagingInstance = async () => {
    const supported = await isSupported();
    if (!supported) return null;
    return getMessaging(app);
};
