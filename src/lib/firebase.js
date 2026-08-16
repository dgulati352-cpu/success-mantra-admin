// Firebase config for Success Mantra Admin Panel
// Uses the same Firebase project as the student portal for real-time sync

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDyDZ5B7B962WZScIxXlYVujRBwQvhTOkY',
  authDomain: 'success-mantra-2671a.firebaseapp.com',
  projectId: 'success-mantra-2671a',
  storageBucket: 'success-mantra-2671a.firebasestorage.app',
  messagingSenderId: '369406814456',
  appId: '1:369406814456:web:ee356e0e7db8a30ac2f30d',
};

// Initialize Firebase App singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export default app;
