<script lang="ts">
    import type { PageData } from "./$types";
    import { page } from "$app/stores";
    import { enhance } from "$app/forms";
    export let data: PageData;
</script>

<main class="max-w-lg prose text-center mx-auto my-6">
    <p>Current Bio: <span class="text-info">{data.bio}</span></p>

    <!-- 
        if submitting a bio over 260 charc long, 
        a fail function is called which updates the 
        page store with a page.form.problem object which we can 
        listen for here and provide feedback to the user with
     -->
    <p>Status Code: {$page.status}</p>
    <p class="text-error">{$page.form?.problem ?? ""}</p>

    <!-- 
        Form has submission method of POST instead of on-submit event handler 
        (which would be entirely client-side)
        This is becuase this form submission will be sent to the server 
        to be handled by a svelte kit action
        Svelte kit action is a convenient way to handle server side code

        In textarea, the value is set to the bio data 
        we fetch from the server (e.g. data.bio)
        The name used here is important becuase we'll use it to change 
        the data on the server as well in +page.server.ts

        If you submit this form without 'use:enhance', it makes 
        a full page reload when submitted because that is default HTML. 
        With svelte, you can add 'use:enhance' to the form so that it uses 
        JavaScript to submit the info and the page is not entirely re-rendered.
     -->
    <form method="POST" use:enhance>
        <div class="form-control">
            <label for="bio" class="label">
            <span class="label-text">Your bio</span>
            </label>
            <textarea
                name="bio"
                class="textarea textarea-bordered textarea-accent"
                value={data.bio}
            />
        </div>
        <div class="flex flex-col">
            <button class="btn btn-primary mx-auto my-4">Update Bio</button>
            <a class="btn btn-primary mx-auto my-4" href={`/${data.username}`}>Return to profile</a>
        </div>
    </form>
</main>