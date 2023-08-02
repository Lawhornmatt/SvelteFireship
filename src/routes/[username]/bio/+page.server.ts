import type { PageServerLoad } from './$types';
import { adminAuth, adminDB } from "$lib/server/admin";
import { error } from "@sveltejs/kit";

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