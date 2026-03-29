// ─────────────────────────────────────────────────────────────
// src/firebase/config.js
// Replace the placeholder values below with your own Firebase
// project credentials from:
//   https://console.firebase.google.com
//   Project Settings → Your apps → SDK setup and configuration
// ─────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export Firestore database instance
export const db = getFirestore(app);
export default app;
