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
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: "nkululekodotio-2b22e.firebaseapp.com",
    projectId: "nkululekodotio-2b22e",
    storageBucket: "nkululekodotio-2b22e.appspot.com",
    messagingSenderId: "377078694096",
    appId: "1:377078694096:web:f81e98ea81a9e0757dded5",
    measurementId: "G-3DZQS551RV"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { auth, db, storage, database }