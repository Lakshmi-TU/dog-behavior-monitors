import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAm5Eyfmh4hNFXi4ZEpaCl5qb6artt6Nsg",
  authDomain: "dog-aggression.firebaseapp.com",
  databaseURL: "https://dog-aggression-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dog-aggression",
  storageBucket: "dog-aggression.firebasestorage.app",
  messagingSenderId: "891717369943",
  appId: "1:891717369943:web:56df6cf029462ca94be312",
};

const app = initializeApp(firebaseConfig);


// ✅ EXPORT THESE (IMPORTANT)
export const db = getDatabase(app);
export const firestore = getFirestore(app);