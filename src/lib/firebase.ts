import { initializeApp } from "firebase/app";
import { getFirestore, onSnapshot, doc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { writable, derived, type Readable } from "svelte/store";

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

// A store with the current fireabse user 
function userStore() {
    let unsubscribe: () => void;

    if (!auth || !globalThis.window) {
        console.warn('Auth is not initialized or not in browser');
        const { subscribe } = writable<User | null>(null);
        return {
            subscribe
        };
    };

    const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
        unsubscribe = onAuthStateChanged(auth, (user) => {
            set(user);
        });

        return () => unsubscribe();
    });

    return {
        subscribe
    };
};
export const user = userStore();

// A store with realtime updates on document data
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
// Could not get to work
// line 84: export const userData: Readable<UserData | null> = derived(...
// Error: Cannot find name 'Readable' <- when over 'Readable' in above line

interface UserData {
    username: string;
    bio: string;
    photoURL: string;
    links: any[];
};

export const userData: Readable<UserData | null> = derived(user, ($user, set) => { 
    if ($user) {
        return docStore<UserData>(`users/${$user.uid}`).subscribe(set);
    } else {
        set(null); 
    }
});  