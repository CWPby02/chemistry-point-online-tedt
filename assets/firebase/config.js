// ==========================================================
// assets/firebase/config.js
// Firebase Modular SDK (v9+) — Initialization
// ==========================================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js';

// ---------- YOUR FIREBASE CONFIG ----------
const firebaseConfig = {
  apiKey: "AIzaSyAJxrqXisH2oBk8naB7TJMnGsoO2RIm6Tg",
  authDomain: "cpes-a88a2.firebaseapp.com",
  databaseURL: "https://cpes-a88a2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cpes-a88a2",
  storageBucket: "cpes-a88a2.firebasestorage.app",
  messagingSenderId: "350376945623",
  appId: "1:350376945623:web:eb884eb5cdac3f05aa0d92"
};

// ---------- Initialize Firebase (only once) ----------
const app = initializeApp(firebaseConfig);

// ---------- Export services ----------
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
