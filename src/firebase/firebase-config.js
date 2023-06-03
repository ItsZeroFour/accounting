// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "accounting-ee596.firebaseapp.com",
  projectId: "accounting-ee596",
  storageBucket: "accounting-ee596.appspot.com",
  messagingSenderId: "190819113390",
  appId: "1:190819113390:web:7b1575c3a14f83e3f8103f",
  measurementId: "G-9GS9PE7YX5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
