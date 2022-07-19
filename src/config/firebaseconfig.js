import firebase from "firebase/compat/app";
import "firebase/compat/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAF3Pm2rU_FutDc8lSr4wXGFiBjIKIPXl4",
  authDomain: "trelloclone-77c96.firebaseapp.com",
  databaseURL: "https://trelloclone-77c96-default-rtdb.firebaseio.com",
  projectId: "trelloclone-77c96",
  storageBucket: "trelloclone-77c96.appspot.com",
  messagingSenderId: "884723740290",
  appId: "1:884723740290:web:375320675dddd99bd74e9b",
  measurementId: "G-JTYC3H63FJ",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();
