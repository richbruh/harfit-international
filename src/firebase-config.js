import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBFTjdG23-Kz9n94Si8nKBMM9HX-RNdi2I",
  authDomain: "harfit-international.firebaseapp.com",
  projectId: "harfit-international",
  storageBucket: "harfit-international.firebasestorage.app",
  messagingSenderId: "581275392060",
  appId: "1:581275392060:web:ba105f341aa33b68448b39",
  measurementId: "G-NVZMZ2BB9V"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;