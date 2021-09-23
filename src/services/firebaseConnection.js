import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCwCL6n1gRAjhJcE3pfvsHnz2O-EU2EFRI",
  authDomain: "call-system-ff419.firebaseapp.com",
  projectId: "call-system-ff419",
  storageBucket: "call-system-ff419.appspot.com",
  messagingSenderId: "98552449772",
  appId: "1:98552449772:web:1941b7cb9e4ede008973c9",
  measurementId: "G-1WD9MQLKQV"
};

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

export default firebase;