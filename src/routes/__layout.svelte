<script lang="ts">
	import Navigation from '$lib/Navigation.svelte';
	import { Styles } from 'sveltestrap';
</script>

<Styles />
<Navigation />

<main>
	<slot />
</main>

<style>
	main {
		padding: 1rem;
	}
</style>