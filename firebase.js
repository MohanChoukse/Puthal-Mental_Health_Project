import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD4ohN-EpLnk4CdoEbW0TJ4eWGns0dC6Og",

  authDomain: "puthal-login.firebaseapp.com",

  projectId: "puthal-login",

  storageBucket: "puthal-login.firebasestorage.app",

  messagingSenderId: "845507635033",

  appId: "1:845507635033:web:52b9007f2c041d08b60e48",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  googleProvider,
  signInWithPopup,
};
