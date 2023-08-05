<script lang="ts">
    import AuthCheck from "$lib/components/AuthCheck.svelte";
    import { db, user, userData } from "$lib/firebase";
    import { doc, getDoc, writeBatch } from "firebase/firestore";
    import { getIdToken } from 'firebase/auth';

    // Local state on the component
    let username = "";
    let loading = false;
    let isAvailable = false;

    /*
        Currently, we read the firestore db EVERYTIME there is an input in the field
        This is a little much to say the least. If someone is typing, let them finish typing before searching
        Goal: once done typing, wait 1/2 a second, and then search the db. This is done with this timer.
    */
    let debounceTimer: NodeJS.Timeout;

    /* 
        Reactive Declarations: re-run this code whenever any of the referenced values change
        Thus, isValid & isTaken & etc. will re-calculate their values if any of the state values 
        (or other reactive declarations) they are based upon change
        We use these plus a regex expression for A) form validation and B) better user feedback and UX

        Sidenote: tutorial says ReactiveDecl. can be overpowered and can lead to hard to trace bugs, 
        with multiple layers of state that depend on one another, so be careful & use responsibly
    */
    const re = /^(?=[a-zA-Z0-9._]{3,16}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
    $: isValid = username?.length > 2 && username.length < 16 && re.test(username);
    $: isTouched = username.length > 0;
    $: isTaken = isValid && !isAvailable && !loading;

    // Query firestore to see if that username is taken
    async function checkAvailability() {
        isAvailable = false;
        // If they start typing again, we cancel the last timer, and start another below
        clearTimeout(debounceTimer);
        loading = true;

        // We take the logic of querying our db and wrap it around our timer, so we can wait .5s until done typing
        debounceTimer = setTimeout(async () => {
            console.log("Checking availability of: ", username);
    
            const ref = doc(db, "usernames", username);
            const exists = await getDoc(ref).then((doc) => doc.exists());
    
            isAvailable = !exists;
            loading = false;
        }, 500);
    };

    /*
        Writes that new username to the database. We are writing to both user & username document, so,
        we want these changes to be atomic (succeed or fail together) so we use a batch to make multiple
        write operation to be executed together
    */
    async function confirmUsername() {
        console.log("confirming username: ", username);
        const batch = writeBatch(db);
        batch.set(doc(db, "usernames", username), { uid: $user?.uid});
        // Notice ! and not a ?, the user MUST exist, cannot be null
        batch.set(doc(db, "users", $user!.uid), {
            username,
            photoURL: $user?.photoURL ?? null,
            published: true,
            bio: "test bio bby",
            links: [
                {
                    title: 'Test Link',
                    url: 'https://lawhornmatt.com',
                    icon: 'custom'
                }
            ]
        });

        await batch.commit();

        // Reset state
        username = "";
        isAvailable = false;

        // Now, add claim onto their auth saying they've finished making an account
        // auth.currentUser -> $user
        if ($user) {
            const idToken = await getIdToken($user, false);

            // Send token to your backend via fetch API
            const res = fetch("/api/profile", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({ idToken }),
            });
        };
    };
</script>

<AuthCheck>
    {#if $userData?.username}
        <p class="text-lg">
            Your username is 
            <span class="text-success font-bold">
                @{$userData.username}
            </span>
        </p>
        <p class="text-sm">(Usernames cannot be changed)</p>
        <a class="btn btn-primary" href="/login/photo">Change Profile Image</a>
        <a class="btn btn-primary" href={`/dashboard`}>Go to your dashboard</a>
    {:else}
        <!-- 
            submitting calls confirmUsername, but we also easily prevent the default action by piping preventDefault 
            We also bind the value of the input field to the local component 'username' state
            Every input calls the checkAvailability function
        -->
        <form class="w-2/5" on:submit|preventDefault={confirmUsername}>
            <input
                type="text"    
                placeholder="Username"
                class="input w-full"
                bind:value={username}
                on:input={checkAvailability}
                class:input-error={(!isValid && isTouched)}
                class:input-warning={isTaken}
                class:input-success={(isValid && isAvailable && !loading)}
            />

            <!-- Use local component state to give feedback to user on username status for good UX -->
            <div class="my-4 min-h-16 px-8 w-full text-sm">
                {#if loading}
                    <p class="text-secondary">
                        Checking availability of @{username}...
                    </p>
                {/if}

                {#if !isValid && isTouched}
                    <p class="text-error">
                        must be 3 - 16 characters long, alphanumeric only
                    </p>
                {/if}

                {#if isValid && !isAvailable && !loading}
                    <p class="text-warning">
                        @{username} is not available
                    </p>
                {/if}
            </div>

            <p>Is available? {isAvailable}</p>

            <button class="btn btn-success">Confirm username @{username} </button>
        </form>
    {/if}
</AuthCheck>