<script>
    import { userData } from "$lib/firebase";
</script>

{#if $userData}
    <slot />
{:else}
    <p class="text-error my-10 flex flex-col">
        Complete your profile before continuing
        <a class="btn btn-primary" href="/login/username">Choose a username</a>
    </p>
{/if}