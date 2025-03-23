// Import the functions you need from the SDKs you need
import { initializeApp } from "@firebase/app";
import { getAnalytics } from "@firebase/analytics";
import { getFirestore } from '@firebase/firestore';
import { getStorage } from '@firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAufoW98y5JrVXdIUiLR-hwzm2rp15rmvg",
  authDomain: "rohith-s-portfolio-58cea.firebaseapp.com",
  projectId: "rohith-s-portfolio-58cea",
  storageBucket: "rohith-s-portfolio-58cea.appspot.com", 
  messagingSenderId: "869587418877",
  appId: "1:869587418877:web:9b675da708275279074894",
  measurementId: "G-SW588H2P9F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 