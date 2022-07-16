// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";

import { getAuth} from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import {getStorage} from 'firebase/storage';
import {getDatabase} from 'firebase/database';


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBL7g4qRpaok0qdPC5HEblpfEZ0MSLUJ5g",
  authDomain: "nkululekoprojects-1353e.firebaseapp.com",
  projectId: "nkululekoprojects-1353e",
  storageBucket: "nkululekoprojects-1353e.appspot.com",
  messagingSenderId: "1013619489476",
  appId: "1:1013619489476:web:398ca3ae17ad438142a791",
  measurementId: "G-8YVGBPJQNJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { auth, db, storage, database }