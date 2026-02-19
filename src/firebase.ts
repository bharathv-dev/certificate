import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyApEq3L6sOdGZ0KP0kj1CmZOnsA9S6N9ZQ",
    authDomain: "clg-09.firebaseapp.com",
    projectId: "clg-09",
    storageBucket: "clg-09.firebasestorage.app",
    messagingSenderId: "122921376394",
    appId: "1:122921376394:web:48b4aa88faaa9aa849eb73"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
export default app;
