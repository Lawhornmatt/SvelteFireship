import type { LayoutServerLoad } from './$types';
import { redirect } from "@sveltejs/kit";

export const load = (async ({ locals }) => {

    const uid = locals.userID;

    if (!uid) {
        console.log('uh oh, no uid');
        throw redirect(301, "/login");
    };

}) satisfies LayoutServerLoad;