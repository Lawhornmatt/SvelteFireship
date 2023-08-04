<script lang="ts">
    import AuthCheck from "$lib/components/AuthCheck.svelte";
    import { user, userData, storage, db } from "$lib/firebase";
    import { doc, updateDoc } from "firebase/firestore";
    import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

    let previewURL: string;
    let uploading = false;
    
    async function upload(e: any) {
        uploading = true;
        const file = e.target.files[0];

        // Optional, but gives user chance to preview image
        previewURL = URL.createObjectURL(file);

        //Storing file in firebase
        const storageRef = ref(storage, `users/${$user!.uid}/profile.png`);
        const result = await uploadBytes(storageRef, file);

        //Now that image is stored in Storage
        //Store it's URL with the user document
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc(db, "users", $user!.uid), { photoURL: url });
        uploading = false;
    };
</script>

<AuthCheck>
    <h2 class="card-title">Upload a Profile Photo</h2>

    {#if $userData?.username}
    <form class="max-w-screen-md w-full">
        <div class="form-control w-full max-w-xs my-10 mx-auto text-center">
            <img 
                src={previewURL ?? $userData?.photoURL ?? "/user.png"}
                alt="photoURL"
                width="256"
                height="256"
                class="mx-auto"
            />
            <label for="photoURL" class="label">
                <span class="label-text">Pick a file</span>
            </label>
            <input
                on:change={upload}
                name="photoURL"
                type="file"
                class="file-input file-input-bordered w-full max-w-xs"
                accept="image/png, image/jpeg, image/gif, image/webp"
            />
            {#if uploading}
                <p>Uploading...</p>
                <progress class="progress progress-info w-56 mt-6"/>
            {/if}
        </div>
    </form>
    {:else}
    <p class="text-error my-10 flex flex-col">
        Please create a username before uploading a profile photo
        <a class="btn btn-primary" href="/login/username">Choose username</a>
    </p>
    {/if}
</AuthCheck>