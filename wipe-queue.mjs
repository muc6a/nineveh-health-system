import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBQmCciaNSDdCQ6vA6PgcjUThPFtx7TMSE",
  authDomain: "nineveh-health.firebaseapp.com",
  projectId: "nineveh-health",
  storageBucket: "nineveh-health.firebasestorage.app",
  messagingSenderId: "352779322862",
  appId: "1:352779322862:web:333704a2bbb58c2483faff",
  measurementId: "G-NB4LKYNLK8"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const wipeQueue = async () => {
  try {
    const dbRef = ref(db, 'prototype_state/penaltyRequests');
    await set(dbRef, null); // Wipe it out completely
    console.log("SUCCESSFULLY WIPED PENALTY REQUESTS QUEUE!");
    process.exit(0);
  } catch (error) {
    console.error("Error wiping queue:", error);
    process.exit(1);
  }
};

wipeQueue();
