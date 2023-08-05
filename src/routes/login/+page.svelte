<script lang="ts">
    import { goto } from '$app/navigation';
    import { auth, user, userData } from '$lib/firebase';
    import { getIdToken } from 'firebase/auth';

    import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

    async function signInWithGoogle() {
        /*
            const provider = new GoogleAuthProvider();
            const user = await signInWithPopup(auth, provider);
            console.log(user);

            Above is the old code for ONLY client-side signing-in with Google authentication
            Now we are expanding this by extracting the ID token after signing in via Google...
        */
        const provider = new GoogleAuthProvider();
        const credential = await signInWithPopup(auth, provider);
        const idToken = await credential.user.getIdToken();
        // ...With the token, we can use browser fetch, to make a call to our 'api/signin' route 
        const res = await fetch("/api/signin", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
                "accept": "application/json"
                // Normally, this would be here but this is handled by sveltekit automatically
                // 'CSRF-Token': csrfToken 
            },
            body: JSON.stringify({ idToken }),
        });

        // We parse the response and see if the user has finished profile creation. 
        // If so, we redirect to the dashboard
        const response = await res.json();
        if (response.profile) {
            goto('/dashboard');
        };
    };

    // We dont just want to signout in the client, we also want to delete the cookie, too
    async function signOutSSR() {
        const res = await fetch("/api/signin", { method: "DELETE" });
        await signOut(auth);
    };
</script>

<!-- Reference the user store and, if present, display their info. If not, present the log-in button -->
{#if $user}
    <h2 class="card-title">Welcome, {$user.displayName}</h2>
    <p class="text-center text-success">You are logged in</p>
    <!-- This block is incase you are logged in and taken else where but still navigate back to /login -->
    {#if !$userData}
        <a class="btn btn-primary" href="/login/username">Choose a username</a>
    {:else}
        <a class="btn btn-primary" href={`/dashboard`}>Go to your dashboard</a>
    {/if}
    <button class="btn btn-danger" on:click={signOutSSR}>Sign out</button>
{:else}
    <h2>Login</h2>
    <button class="btn btn-primary" on:click={signInWithGoogle}>Sign in with Google</button>
{/if}

<!-- 
    Clicking button creates a popup where the user can sign into their Google account
    Successfully signing in returns a JSON webtoken to the client browser
    showing them logged in and basic account information
    This is good enough for client side logging in with Firebase SDK 
    but does not verify authentication status on the server 
    (this is fine if client side is all you need)
 -->