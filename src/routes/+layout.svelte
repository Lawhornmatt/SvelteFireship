<script lang="ts">
    import { user, userData } from "$lib/firebase";
    import "./app.css";

    $user;
    $userData;

    /* Debug Functions for Buttons
    function debugUserStore() {
        console.log('User Store:');
        console.log($user);
    };
    
    function debugUserDataStore() {
        console.log('UserData:');
        console.log($userData);
    };
    
    function debugPageStore() {
        console.log('PageData:');
        console.log($page);
    };
    */
</script>

<!-- Debug Buttons to see current state of store as one navigates site
    <button class="btn btn-primary" on:click={debugUserStore}>See user</button>
    <button class="btn btn-primary" on:click={debugUserDataStore}>See userData</button>
    <button class="btn btn-primary" on:click={debugPageStore}>See page</button>
 -->

<div class="min-h-screen flex flex-col">
    <slot />
</div>