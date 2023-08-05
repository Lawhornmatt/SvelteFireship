<script>
  export let username = 'some cool user';
  export let photoURL = 'default.png';
</script>

<!-- 
  When looking at all users, this link will be used 
  to give a link to a specific user profile
 -->
 
<a href={`/${username}`} class="stack w-full text-center bg-base-300 flex justify-center items-center p-4 rounded-lg not-prose no-underline my-2">
  <span class="text-lg text-white font-bold">@{username}</span>
  <img src={photoURL} alt='icon' width="32" height="32" class="w-8" />
</a>
