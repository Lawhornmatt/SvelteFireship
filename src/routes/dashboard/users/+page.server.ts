import type { PageServerLoad } from './$types';
import { collection, getDocs } from "firebase/firestore"
import { db } from "$lib/firebase";
import { error } from "@sveltejs/kit";

export const load = (async ({ parent }) => {
    
    await parent();
    console.log('Querying DB for all usernames');

    const collectionRef = collection(db, "users");
    const usersSnapshot = await getDocs(collectionRef);

    const exists = usersSnapshot.docs[0]?.exists();
    if (!exists) {
        throw error(404, "No users found!");
    };

    const users = usersSnapshot.docs
        .map((doc) => { 
            let stract = doc.data();
            return { 
                username: stract.username,
                published: stract.published,
                photoURL: stract.photoURL 
            };
        })
        .filter((stract) => stract.published
    );

    return { users };

}) satisfies PageServerLoad;