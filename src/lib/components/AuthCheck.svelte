<script>
    import { user } from "$lib/firebase";
</script>

<!-- 
    Similar to log-in page: if user NOT present, 
    do not show slotted component and instead give a button to go to said log-in page 
-->
{#if $user}
    <slot />
{:else}
    <p class="text-error my-10 flex flex-col">
        You must be signed-in to view this page.
        <a class="btn btn-primary" href="/login">Sign in</a>
    </p>
{/if}