<script lang="ts">
    import AuthCheck from '$lib/components/AuthCheck.svelte';
    import ProfileCheck from '$lib/components/profileCheck.svelte';
</script>

<main class="card w-4/6 bg-neutral text-neutral-content mx-auto">
    <div class="card-body items-center text-center">
        <AuthCheck>
            <ProfileCheck>
                <slot />
            </ProfileCheck>
        </AuthCheck>
    </div>
</main>