import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// Note: These are publishable keys and are safe to include in client-side code
// You need to replace these values with your actual Firebase project config
const firebaseConfig = {

  apiKey: "AIzaSyCb2xoYNlKF6zk172G789es_56unklfDhY",
  authDomain: "mdfkitsw-1fc52.firebaseapp.com",
  projectId: "mdfkitsw-1fc52",
  storageBucket: "mdfkitsw-1fc52.firebasestorage.app",
  messagingSenderId: "1034541866276",
  appId: "1:1034541866276:web:a1c2d3b5ece1a30e98e7b1",
  measurementId: "G-MYZZKS11CN"
};

// Check if Firebase is configured
const isConfigured = firebaseConfig.apiKey && firebaseConfig.projectId;

// Initialize Firebase only if configured
let app: ReturnType<typeof initializeApp> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;

if (isConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  console.warn('Firebase is not configured. Please add your Firebase config values to the environment variables.');
}

export { auth, db };
export default app;
