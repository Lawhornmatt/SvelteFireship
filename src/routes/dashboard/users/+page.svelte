<script lang="ts">
    import type { PageData } from './$types';
    import ProfileLink from '$lib/components/ProfileLink.svelte';

    export let data: PageData;
</script>

<!-- Displays a list of links to all published users -->

<div class="flex flex-col w-full justify-center items-center mt-16">
    <ul class="list-none w-4/5 xl:w-2/5">
        {#each data.users as item}
            <ProfileLink {...item} />
        {/each}
    </ul>
    <a class="btn btn-primary mx-auto my-4" href={`/dashboard`}>Return to dashboard</a>
</div>
