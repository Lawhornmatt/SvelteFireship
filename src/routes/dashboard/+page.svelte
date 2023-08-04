<script lang="ts">
    import { userData } from '$lib/firebase';
</script>

<!-- 
    A dashboard where one can take various actions, i.e. view your profile and see the profiles of all published users
 -->
<div class="card-body items-center text-center">
    <h2 class="card-title">Welcome @{$userData?.username}</h2>
    <a class="btn btn-primary mx-auto my-4" href={`/${$userData?.username}`}>View your profile</a>
    <a class="btn btn-primary mx-auto my-4" href={`/dashboard/users`} data-sveltekit-preload-data="tap">View all users</a>

    <div class="btn btn-neutral mx-auto my-4">Disabled</div>
    <div class="btn btn-neutral mx-auto my-4">Disabled</div>
</div>
