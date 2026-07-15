import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBQmCciaNSDdCQ6vA6PgcjUThPFtx7TMSE",
  authDomain: "nineveh-health.firebaseapp.com",
  projectId: "nineveh-health",
  storageBucket: "nineveh-health.firebasestorage.app",
  messagingSenderId: "352779322862",
  appId: "1:352779322862:web:333704a2bbb58c2483faff",
  measurementId: "G-NB4LKYNLK8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const db = getDatabase(app);
