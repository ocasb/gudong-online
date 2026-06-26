import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCCYGN5GXyINCiR8BbMXjCyfyBsTtY2WwE",
  authDomain: "ocasb-e2b5f.firebaseapp.com",
  projectId: "ocasb-e2b5f",
  storageBucket: "ocasb-e2b5f.firebasestorage.app",
  messagingSenderId: "419914748235",
  appId: "1:419914748235:web:8bb10f17b7d8885d5898ce",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;