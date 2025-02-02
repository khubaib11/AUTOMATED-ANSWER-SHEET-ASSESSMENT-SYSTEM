// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {getStorage} from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "sheetai-f4337.firebaseapp.com",
  projectId: "sheetai-f4337",
  storageBucket: "sheetai-f4337.firebasestorage.app",
  messagingSenderId: "459246517375",
  appId: "1:459246517375:web:0edb048fdfb287bf55134a",
  measurementId: "G-DXD3M3XXRX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);


export { app, analytics, db, storage };  