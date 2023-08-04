import type { PageServerLoad, Actions } from './$types';
import { adminAuth, adminDB } from "$lib/server/admin";
import { error, redirect, fail } from "@sveltejs/kit";

/* OLD LOAD METHOD: 
    Allowed access to this specific route via verifying the stored session cookie
    But this was specific to this route, so it was refactored 
    to be usable on any server end-point via svelte hooks
   Load Post-refactor:
*/
export const load = (async ({ locals, params }) => {

    // Gets the user id via Locals event object instead of directly from cookie
    const uid = locals.userID;

    if (!uid) {
        console.log('uh oh, no uid');
        throw redirect(301, "/login");
    };

    // Immediately jump into authenticated data fetching
    const userDoc = await adminDB.collection("users").doc(uid).get();
    // I still dont know what this "!" is doing here and Google is impossible
    // remember to ask a mentor one day who is good at TypeScript
    const { username, bio } = userDoc.data()!;

    if (params.username !== username) {
        throw error(401, "That username does not belong to you");
    };

    return {
        username,
        bio,
    };
}) satisfies PageServerLoad;


export const actions = {

    // If you only have one form on the page, you likely only need one action, which should be name default
    // It has access to all the same obj as we did in data fetching
    default: async ({ locals, request, params }) => {

        // grab uid from locals just like we did on load
        const uid = locals.userID;

        // grab form data from page.svelte
        const data = await request.formData();
        const bio = data.get('bio');

        // find the user doc using uid and update the bio information
        const userRef = adminDB.collection("users").doc(uid!);
        const { username } = (await userRef.get()).data()!;

        // in actions we can do some validation like:
        // ...is this your username?
        if (params.username !== username) {
            throw error(401, "That username does not belong to you");
        };
        // ...are you submitting too long of a bio?
        if (bio!.length > 260) {
            // This doesnt send us to a whole new error page, instead it updates the page store with a page.problem object
            return fail(400, { problem: "Bio must be less than 260 characters" });
        };

        // If validation doesnt throw err, we update the doc on the db
        await userRef.update({
            bio,
        });
    },
} satisfies Actions;