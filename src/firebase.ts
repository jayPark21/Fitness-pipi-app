import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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
