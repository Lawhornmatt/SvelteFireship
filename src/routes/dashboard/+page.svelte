<script lang="ts">
    import { userData } from '$lib/firebase';
</script>


<div class="card-body items-center text-center">
    <h2 class="card-title">Welcome @{$userData?.username}</h2>
    <a class="btn btn-primary mx-auto my-4" href={`/${$userData?.username}`}>View your profile</a>
    <a class="btn btn-primary mx-auto my-4" href={`/users`}>View all users</a>

    <div class="btn btn-neutral mx-auto my-4">Disabled</div>
    <div class="btn btn-neutral mx-auto my-4">Disabled</div>
</div>
