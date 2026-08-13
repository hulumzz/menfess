import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC4lEQfpXosKTLbpv25Tsdb_YZdBXSV5pg",
  authDomain: "menfess-8f2b7.firebaseapp.com",
  projectId: "menfess-8f2b7",
  storageBucket: "menfess-8f2b7.firebasestorage.app",
  messagingSenderId: "876546975569",
  appId: "1:876546975569:web:61c92d9bda5e3bb2771570",
  measurementId: "G-HSG2S5J296"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
