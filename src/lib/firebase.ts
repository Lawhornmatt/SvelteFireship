import { initializeApp } from "firebase/app";
import { getFirestore, onSnapshot, doc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { writable, derived, type Readable } from "svelte/store";

// onAuthStateChanged: a firebase function that tells when authentication state changes
// onSnapshot: listen for any changes in the database in realtime
/* 
    a writable store: a data structure with a current value 
    and one can push new values onto it, when the value changes 
    svelte will rerender to show the new data
*/

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

// ===== USER STORE =====
// A store telling the authentication state of the user + some user info like ID
function userStore() {
    /*
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/void
        void operator still allows first-time evaluation but will afterwards return undefined
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/label
        Here, i *believe* unsubscribe is a label 
    */
    let unsubscribe: () => void;

    // This script is meant for client-side. So when it gets server side rendered, it will fall back to this piece
    if (!auth || !globalThis.window) {
        console.warn('Auth is not initialized or not in browser');
        const { subscribe } = writable<User | null>(null);
        return {
            subscribe
        };
    };

    /*
        we create a new 'writable store' and destructure it's built-in subscribe method
        First arg is: 'auth?.currentUser ?? null' meaning default value will be the current user from firebase auth (or null if nobody signed in)
        Second arg: call back with 'set' function which allows us to change the value of the store
        We will make this change by calling onAuthStateChanged, which notifies everytime the auth state changes and then set the user to the new 'user'
    */
    const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
        unsubscribe = onAuthStateChanged(auth, (user) => {
            set(user);
        });

        /*
            Unsure exactly how this logic works, but the goal is to unsubscribe from the auth state when the store is no longer used in UI
            This is important with firestore data, dont want unnecessary reads. The unsubscribe function comes from onAuthStateChanged.
            Thus, the unsubscribe gets called when we no longer have any subscribers
        */
            return () => unsubscribe();
    });

    return {
        subscribe
    };
};
// Use anywhere by exporting it + user is a more weildable name than the longer userStore
export const user = userStore();


/*
    Goal: we want a svelte store that takes in the user.uid from the user store, 
    listens to the doc in the user collection with that uid on the firestore,
    and update with the current user information everytime it changes.

    We'll do this in two pieces 
        1) A generic doc store for listening to docs (called docStore) 
        2) Part 1 combined with user to listen specifically to user data (called userData)
*/

// ===== DOC STORE =====
// A re-usable store for realtime updates on document data
export function docStore<T>(
     path: string
) {
    let unsubscribe: () => void;

    const docRef = doc(db, path);

    const { subscribe } = writable<T | null>(null, (set) => {
        unsubscribe = onSnapshot(docRef, (snapshot) => {
            set((snapshot.data() as T) ?? null);
        });

        return () => unsubscribe();
    });

    return {
        subscribe,
        ref: docRef,
        id: docRef.id
    }
};

// For TypeScript, to provide intellisense for the kind of fields we expect to receive from the document
interface UserData {
    username: string;
    bio: string;
    photoURL: string;
    links: any[];
};


// ===== USER DATA ====
// A derived store = two or more stores combined. Uses docStore to specifically update with changes in user data through the $user store
export const userData: Readable<UserData | null> = derived(user, ($user, set) => { 
    if ($user) {
        return docStore<UserData>(`users/${$user.uid}`).subscribe(set);
    } else {
        set(null); 
    }
});  