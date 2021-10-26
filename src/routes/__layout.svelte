<script lang="ts">
	import Navigation from "$lib/Navigation.svelte";
	import { Nav, Navbar, NavbarBrand, NavLink, Styles } from "sveltestrap";

	import "bootstrap/dist/css/bootstrap.min.css";
	import "../app.css";
</script>

<div
	class="side-navbar nav-active d-flex justify-content-between flex-wrap flex-column"
	id="sidebar"
>
	<Navigation />
</div>

<div class="p-1 my-container content-active">
	<main>
		<slot />
	</main>
</div>

<style>
	main {
		padding: 1rem;
	}

	.side-navbar {
		width: 180px;
		height: 100%;
		position: fixed;
		margin-left: -300px;
		background-color: #f1f1f1;
		border: 0px solid #d5d5d5;
		border-right-width: 1px;
		transition: 0.5s;
	}

	.nav-active {
		margin-left: 0px;
	}

	.content-active {
		margin-left: 250px;
	}
</style>
