import { adminAuth } from '$lib/server/admin';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {

    const { idToken } = await request.json();

    const decodedIdToken = await adminAuth.verifyIdToken(idToken);

    await adminAuth.setCustomUserClaims(decodedIdToken.sub, {
        profile: true
    });
    
    return json({ status: 'success' });
};