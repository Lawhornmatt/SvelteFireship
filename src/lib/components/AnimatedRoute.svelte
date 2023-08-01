<script>
    import { fly } from "svelte/transition";
    import { page } from "$app/stores";
</script>

<!-- 
    in: applies animation when component first appears
    fly is type of animation
    Question: how do we know when to rerender (and thus animate) this component when the URL changes?
    Answer: key rebuilds its children when the value to it's right changes
-->
{#key $page.url}
    <div in:fly={{ x:'-100%', duration: 500 }}>
        <slot />
    </div>
{/key}