import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCULM-H-xOefPg9Ms3SS58upDRYWvb39W4",
  authDomain: "westalk-64a78.firebaseapp.com",
  projectId: "westalk-64a78",
  storageBucket: "westalk-64a78.firebasestorage.app",
  messagingSenderId: "535715960915",
  appId: "1:535715960915:web:386addb639db87b4e44ea6",
  measurementId: "G-H1WQ1WC4G2",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
