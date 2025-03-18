// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDZP_mRsRpdyQkRtmj_1c4SNW0QV2eiU1o",
  authDomain: "task-manager-f585c.firebaseapp.com",
  projectId: "task-manager-f585c",
  storageBucket: "task-manager-f585c.firebasestorage.app",
  messagingSenderId: "259837388391",
  appId: "1:259837388391:web:771d5a7df157c50c5dd6c2",
  measurementId: "G-587GD7B32F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, app };