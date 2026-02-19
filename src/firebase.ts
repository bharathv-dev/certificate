import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyAgNdkMpB6NifmayR3mkhyrppNVM8aXTZA",
    authDomain: "skacas-events-management.firebaseapp.com",
    projectId: "skacas-events-management",
    storageBucket: "skacas-events-management.firebasestorage.app",
    messagingSenderId: "344761161721",
    appId: "1:344761161721:web:d950b3aa28a3fbabe88f28",
    measurementId: "G-D2Y1DPC30D"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
export default app;
