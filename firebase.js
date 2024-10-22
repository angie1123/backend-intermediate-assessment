// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCxLzthDX8QMrCirzTC5Gf6XMQm8cvA7Fk",
  authDomain: "backend-intermediate.firebaseapp.com",
  projectId: "backend-intermediate",
  storageBucket: "backend-intermediate.appspot.com",
  messagingSenderId: "18587303787",
  appId: "1:18587303787:web:01c4d3af827468307b562e",
  measurementId: "G-W1YZSVR8ES"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage=getStorage(app)
