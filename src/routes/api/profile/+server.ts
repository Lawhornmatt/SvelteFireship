import { adminAuth } from '$lib/server/admin';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {

    // Nab the cookie with our stored idToken
    // const sessionCookie = cookies.get("__session");

    // const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie!);

    // const claims = await adminAuth.verifyIdToken(sessionCookie!); 

    const { idToken } = await request.json();

    const decodedIdToken = await adminAuth.verifyIdToken(idToken);

    await adminAuth.setCustomUserClaims(decodedIdToken.sub, {
        profile: true
    });

    // console.log('Server idToken: ')
    // console.log(idToken)
    // console.log('Server decoded: ')
    // console.log(decodedIdToken)
    return json({ status: 'success' });
};