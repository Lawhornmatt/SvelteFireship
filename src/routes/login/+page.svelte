<script lang="ts">
    import { auth, user } from '$lib/firebase';

    import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        const user = await signInWithPopup(auth, provider);
        console.log(user);
    }    
</script>

<h2>Login</h2>

<!-- Reference the user store and, if present, display their info. If not, present the log-in button -->
{#if $user}
    <h2 class="card-title">Welcome, {$user.displayName}</h2>
    <p class="text-center text-success">You are logged in</p>
    <button class="btn btn-danger" on:click={() => signOut(auth)}>Sign out</button>
{:else}
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