import { getApp, getApps, initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";



// const firebaseConfig = {
//   apiKey: "AIzaSyAD7KEfM_JRc6EaNe21Ae8iWL8DxTLneWM",
//   authDomain: "hmbiz-7b4c3.firebaseapp.com",
//   projectId: "hmbiz-7b4c3",
//   storageBucket: "hmbiz-7b4c3.appspot.com",
//   messagingSenderId: "114492552685",
//   appId: "1:114492552685:web:a1c78be98e3ee8ff4323e4"
// };


const firebaseConfig = {
  apiKey: "AIzaSyDCCWKQDNqvA8rMekYGxIFUAxQMNpSe4p4",
  authDomain: "evspace-87918.firebaseapp.com",
  projectId: "evspace-87918",
  storageBucket: "evspace-87918.appspot.com",
  messagingSenderId: "358270168379",
  appId: "1:358270168379:web:8218e5d0d676c32461db1e",
  measurementId: "G-BD2GMTJP26"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export {app, db, storage};