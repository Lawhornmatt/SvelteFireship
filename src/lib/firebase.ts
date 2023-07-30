import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBhFhZ8xQXxDXDtOylXgdXSqXRgVvSAUpQ",
    authDomain: "fireship-svelte-tut.firebaseapp.com",
    projectId: "fireship-svelte-tut",
    storageBucket: "fireship-svelte-tut.appspot.com",
    messagingSenderId: "196173723211",
    appId: "1:196173723211:web:07daebad35cb6d549dbfce"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();