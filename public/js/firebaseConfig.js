import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCxhFFscrKkkHEJbnuXOeNGfUyVk6h4v_o",
    authDomain: "hexa-b08d5.firebaseapp.com",
    projectId: "hexa-b08d5",
    storageBucket: "hexa-b08d5.appspot.com",
    messagingSenderId: "1067149061824",
    appId: "1:1067149061824:web:b8396e8ff5b1e3f9fc4725",
    measurementId: "G-Z94CRED3JC"
};



const app = initializeApp(firebaseConfig); // Initialize the app directly


export const auth = getAuth(app); // Access auth instance using the app
export const db = getFirestore(app);
export const storage = getStorage(app);