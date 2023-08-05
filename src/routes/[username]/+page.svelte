<script lang="ts">
    import type { PageData } from './$types';
    import { page } from "$app/stores";
    import { userData } from "$lib/firebase";
    import UserLink from '$lib/components/UserLink.svelte';
    
    export let data: PageData;
</script>

<!-- 
    'svelte:head' allows us to add data to the head of the html document, like title and meta tags.
    Good for SEO and adding Twitter cards and whatnot     
-->
<svelte:head>
    <title>@{data.username} Links</title>
    <meta name="description" content={data.bio} />
</svelte:head>

<main class="flex flex-col self-center items-center text-center w-4/5 md:w-3/5 xl:w-2/5 mx-8 mt-8">

    <h1 class="text-4xl md:text-5xl xl:text-6xl 2xl:text-7xl text-purple-500 my-4">
        @{data.username}
    </h1>

    <img
        src={data.photoURL ?? "/user.png"}
        alt="photoURL"
        width="256"
        class="mx-auto"
    />

    <p class="text-xl my-8 prose">{data.bio ?? "no bio yet..."}</p>
    {#if data.username === $userData?.username}
    <a class="btn btn-primary mx-auto my-4" href={`/${data.username}/bio`}>Edit your bio</a>
    {/if}

    <ul class="list-none w-4/5">
        {#each data.links as item}
            <UserLink {...item} />
        {/each}
    </ul>

    {#if data.username === $userData?.username}
    <a class="btn btn-primary mx-auto my-4" href={`/${data.username}/edit`}>Edit your links</a>
    {/if}

    <a class="btn btn-primary mx-auto my-4" href={`/dashboard`}>Return to dashboard</a>
</main>