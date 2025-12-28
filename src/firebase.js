// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA9RayrFnvhWM4nERgo1_XE7VFODxMaGgI",
  authDomain: "mondje-salary.firebaseapp.com",
  projectId: "mondje-salary",
  storageBucket: "mondje-salary.firebasestorage.app",
  messagingSenderId: "656111686354",
  appId: "1:656111686354:web:896194180cd40010d7930b",
  measurementId: "G-4EJ3F8FXCN",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
