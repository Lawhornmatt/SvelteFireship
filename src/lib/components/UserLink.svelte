<script>
    export let icon = 'default';
    export let url = 'foo';
    export let title = 'some cool title';
</script>

<!--
    Starts with filler link info and then creates a dummy link component with an anchor tag
-->

<a href={url} class="stack w-full max-w-md text-center bg-base-300 flex justify-center items-center p-4 rounded-lg not-prose no-underline">
  <img src={`/${icon}.png`} alt={icon} width="32" height="32" class="w-8" />
  <span class="text-lg text-white font-bold">{title}</span>
</a>