import { adminAuth } from '$lib/server/admin';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/*
    We already have authentication by Google implemented, so this will build on top of that.
    That one, you get a json from Google with a verification token

    Cookies are values defined on the server, sent to the browser, and stored client side
*/
export const POST: RequestHandler = async ({ request, cookies }) => {

    // This can be pulled from the Google auth
    const { idToken } = await request.json();

    const expiresIn = 1000 * 60 * 60 * 24 * 5; // 5 days

    // Decode securely on firebase server, giving access to user data
    const decodedIdToken = await adminAuth.verifyIdToken(idToken);

    // For added security, lets make sure the auth time on that token was less than 5 min ago
    // because cookie should only be set on a recent authentication
    if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60) {
        // Use AdminAuth SDK to make a new cookie, passing in idToken as arg
        const cookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
        // Important to set path, by default it will be scoped to the URL it was created
        const options = { maxAge: expiresIn, httpOnly: true, secure: true, path: '/'};

        // If deploying to Firebase, must give cookie name of 'double-underscore' session, 
        // i.e. '__session', for firebase to cache it to a CDN
        cookies.set('__session', cookie, options);

        //with cookie set, you can return some json with a status of signed in
        return json({ status: 'signedIn' });
    } else {
        throw error(401, 'Recent sign in required!');
    }
};

// Compared to signing-in, signing-out is easy: just delete the cookie
export const DELETE: RequestHandler = async ({ cookies }) => {
    cookies.delete('__session', { path: '/' });
    return json({ status: 'signedOut' });
};