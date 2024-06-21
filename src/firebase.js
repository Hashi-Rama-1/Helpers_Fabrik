// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDownloadURL,  getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBUsbX0lNGuDwn_sDkqy4djrDJpdL3Qr5g",
  authDomain: "twojs-bdb50.firebaseapp.com",
  projectId: "twojs-bdb50",
  storageBucket: "twojs-bdb50.appspot.com",
  messagingSenderId: "667804797365",
  appId: "1:667804797365:web:0abfa39c37ece6f5bef1fc",
  measurementId: "G-MRTQCCHDXN"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const storageRef = ref(storage, 'models');

export { storage, storageRef, getDownloadURL, ref };