import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC3YhBMnQO9IiVlrQn5lah__RRpnehnY7g",
  authDomain: "festive-mesh-hhl8x.firebaseapp.com",
  projectId: "festive-mesh-hhl8x",
  storageBucket: "festive-mesh-hhl8x.firebasestorage.app",
  messagingSenderId: "565087026689",
  appId: "1:565087026689:web:075133d5965fc9245b0a00"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app, 'ai-studio-1e07317c-d782-4610-ac32-227a75c4c1b4');
