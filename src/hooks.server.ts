import { adminAuth } from "$lib/server/admin";
import type { Handle } from "@sveltejs/kit";

// We changed app.d.ts to allow a new type in the Locals interface called userID

/*
    This code will look very similar to the code written to give access to /[username]/bio via cookie
    The difference is, that was for that specific route where this will be re-useable for any route we need
*/
export const handle = (async ({ event, resolve }) => {
    // Just like before, we get the cookie...
    const sessionCookie = event.cookies.get("__session");
  
    try {
        // ...and then use adminAuth to verify the cookie.
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie!);
        // Difference is, once we have a decodedId, we set it as a value on the event locals object as 'userID'
        // This will allow us to access it from any other server.ts file
        event.locals.userID = decodedClaims.uid;
        console.log("Hook Handle: found user id", decodedClaims.uid);
    } catch (e) {
        // If above fails, set to null AKA user is not logged-in
        console.log("Hook Handle: user id not found");
        event.locals.userID = null;
        return resolve(event);
    };
  
    // We use resolve to move on to whatever logic is next in the server endpoint
    return resolve(event);
}) satisfies Handle;