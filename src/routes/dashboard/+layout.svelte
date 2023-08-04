<script lang="ts">
    import AuthCheck from '$lib/components/AuthCheck.svelte';
</script>

<AuthCheck>
    <slot />
</AuthCheck>