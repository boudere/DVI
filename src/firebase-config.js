// src/firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// 🔧 Reemplaza estos datos con los de tu consola de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCL31kN-RfrF8CiPhiPnxZmGmfYVUI3tV4",
  authDomain: "bitbybit-43aee.firebaseapp.com",
  projectId: "bitbybit-43aee",
  storageBucket: "bitbybit-43aee.firebasestorage.app",
  messagingSenderId: "494311902150",
  appId: "1:494311902150:web:0e6b80bc1889ca702dc0c7"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, db, provider, signInWithPopup };
