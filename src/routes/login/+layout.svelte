<script lang="ts">
    import { page } from "$app/stores";
    import AnimatedRoute from "$lib/components/AnimatedRoute.svelte";
</script>

<nav class="flex flex-col justify-center items-center mt-12 mb-8">
    <ul class="steps">
        <a href="/login" class="step step-primary">Sign In</a>
        <a  href="/login/username" 
            class="step" 
            class:step-primary={$page.route.id?.match(/username|photo/g)}>
            Choose Username
        </a>
        <a  href="/login/photo" 
            class="step"
            class:step-primary={$page.route.id?.includes("photo")}>
            Choose Photo
        </a>
    </ul>
</nav>

<AnimatedRoute>
    <main class="card w-4/6 bg-neutral text-neutral-content mx-auto">
        <div class="card-body items-center text-center">
            <slot></slot>
        </div>
    </main>
</AnimatedRoute>