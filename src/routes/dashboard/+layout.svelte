<script lang="ts">
    import AuthCheck from '$lib/components/AuthCheck.svelte';
    import ProfileCheck from '$lib/components/ProfileCheck.svelte';
</script>

<main class="card w-4/6 bg-neutral text-neutral-content mx-auto mt-8">
    <div class="card-body items-center text-center">
        <AuthCheck>
            <ProfileCheck>
                <slot />
            </ProfileCheck>
        </AuthCheck>
    </div>
</main>