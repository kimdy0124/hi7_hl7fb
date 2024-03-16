// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4Krn4cuEumQHVVS1oRxaaAkHm2h7Suw8",
  authDomain: "hi7-hl7.firebaseapp.com",
  projectId: "hi7-hl7",
  storageBucket: "hi7-hl7.appspot.com",
  messagingSenderId: "410837804656",
  appId: "1:410837804656:web:38fe4aeaccb29d1eee36b5",
//   measurementId: "G-FKBDD0CQC8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);