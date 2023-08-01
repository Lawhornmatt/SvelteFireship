import { collection, getDocs, limit, query, where } from "firebase/firestore"
import type { PageLoad } from './$types';
import { db } from "$lib/firebase";
import { error } from "@sveltejs/kit";

// Uses username value to fetch data from Firestore for that user so we can display it in UI
export const load = (async ({ params }) => {
    
    // Target a collection called "users"
    const collectionRef = collection(db, "users");

    // Query that collection for a user with a username equal to the params username in the URL
    // We only need THE singular user, so we can limit the results by 1
    const q = query(
        collectionRef,
        where("username", "==", params.username),
        limit(1)
    );

    // Executes the query, returns array of document snapshots from firebase
    const snapshot = await getDocs(q)
    // Determine if returned array has a document
    const exists = snapshot.docs[0]?.exists();
    // It exists, so, extract its data
    const data = snapshot.docs[0]?.data();

    // If one navigates to a non-existant username
    if (!exists) {
        throw error(404, "That user does not exist!");
    };

    // If one navigates to a non-public username
    if (!data.published) {
        throw error(403, `The profile of @${data.username} is not public!`);
    };

    // With the data, we return it from this function as an object with fields we want to use in frontend
    // They will be visible in the frontend as 'data' and already be strongly typed
    return {
        username: data.username,
        photoURL: data.photoURL,
        bio: data.bio,
        links: data.links ?? [],
    };
}) satisfies PageLoad;