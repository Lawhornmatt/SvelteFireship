<script lang="ts">
    import { auth, userData } from '$lib/firebase';
    import { signOut } from 'firebase/auth';

    // We dont just want to signout in the client, we also want to delete the cookie, too
    async function signOutSSR() {
        const res = await fetch("/api/signin", { method: "DELETE" });
        await signOut(auth);
    };
</script>

<!-- 
    A dashboard where one can take various actions, i.e. view your profile and see the profiles of all published users
 -->
<div class="card-body items-center text-center">
    <h2 class="card-title">Welcome @{$userData?.username}</h2>
    <a class="btn btn-primary mx-auto my-4" href={`/${$userData?.username}`}>View your profile</a>
    <a class="btn btn-primary mx-auto my-4" href={`/dashboard/users`} data-sveltekit-preload-data="tap">View all users</a>

    <div class="btn btn-neutral mx-auto my-4">Disabled</div>
    <button class="btn btn-danger mx-auto my-4" on:click={signOutSSR}>Sign out</button>
</div>
