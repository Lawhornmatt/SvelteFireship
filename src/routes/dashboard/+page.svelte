<script lang="ts">
    import type { PageData } from './$types';
    import { auth, user, userData } from '$lib/firebase';
    import AuthCheck from '$lib/components/AuthCheck.svelte';
</script>

<AuthCheck>
    <div class="card-body items-center text-center">
        <h2 class="card-title">Welcome, @{$userData?.username}</h2>
        <a class="btn btn-primary" href={`/${$userData?.username}`}>View your profile</a>
    </div>
</AuthCheck>