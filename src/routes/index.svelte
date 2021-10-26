<script lang="ts">
    import { file } from "$lib/global";
</script>

<h1>Welcome to SvelteKit</h1>
<p>
    Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>

File to open:<input bind:value={$file} />
