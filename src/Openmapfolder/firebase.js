// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCc-4eck1lN69RJuCeBMGcfi8_DukIWrpI",
  authDomain: "eventomania-80574.firebaseapp.com",
  projectId: "eventomania-80574",
  storageBucket: "eventomania-80574.firebasestorage.app",
  messagingSenderId: "1008851731574",
  appId: "1:1008851731574:web:1c8026819606e49eee0b57",
  measurementId: "G-TC34NFBNL1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const db = getFirestore(app)

