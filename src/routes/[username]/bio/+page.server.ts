import type { PageServerLoad } from './$types';
import { adminAuth, adminDB } from "$lib/server/admin";
import { error, redirect } from "@sveltejs/kit";

/* OLD METHOD: 
    Allowed access to this specific route via verifying the stored session cookie
    But this was specific to this route, so it was refactored 
    to be usable on any server end-point via svelte hooks

export const load = (async ({ cookies }) => {    
    // retrieve the session cookie
    const sessionCookie = cookies.get('__session');
    try {
        // Use the firebase SDK's adminAuth to verify the cookie
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie!);
        // Then fetch the user data from the firestore db
        const userDoc = await adminDB.collection('user').doc(decodedClaims.uid).get();
        const userData = userDoc.data();

        // Return the user data, allowing us to use it in the page.svelte file
        return {
            bio: userData?.bio,
        }
    } catch (e) {
        console.log(e);
        //redirect(301, '/login);
        throw error(401, 'Unauthorized request!');
    };
}) satisfies PageServerLoad;
*/


// Post-refactor
export const load = (async ({ locals, params }) => {

    // Gets the user id via Locals event object instead of directly from cookie
    const uid = locals.userID;

    if (!uid) {
        console.log('uh oh, no uid');
        throw redirect(301, "/login");
    };

    // Immediately jump into authenticated data fetching
    const userDoc = await adminDB.collection("users").doc(uid).get();
    const { username, bio } = userDoc.data()!;

    if (params.username !== username) {
        throw error(401, "That username does not belong to you");
    };

    return {
        bio,
    };
}) satisfies PageServerLoad;
