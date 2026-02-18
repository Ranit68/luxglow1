import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDRMxnjsrMoFBNXjqSaqgX4M03ibz1ZMzI",
  authDomain: "luxxglow.firebaseapp.com",
  projectId: "luxxglow",
  storageBucket: "luxxglow.firebasestorage.app",
  messagingSenderId: "812411181954",
  appId: "1:812411181954:web:df8067c9857f791c824d9b",
  measurementId: "G-G7YEYYHV2C"

};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
