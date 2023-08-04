import type { LayoutServerLoad } from './$types';
import { redirect } from "@sveltejs/kit";

export const load = (async ({ locals }) => {

    const uid = locals.userID;

    if (!uid) {
        console.log('No uid, Redirect to log-in');
        throw redirect(301, "/login");
    };

    console.log(locals);

}) satisfies LayoutServerLoad;