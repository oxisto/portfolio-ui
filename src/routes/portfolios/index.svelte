<script lang="ts" context="module">
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ page, fetch, session, context }) {
		const apiUrl = "/api/v0/portfolios";
		return fetch(apiUrl, {
			headers: {
				"x-pp-token": "mytoken",
				"x-pp-file": file,
			},
		})
			.then((res) => res.json())
			.then((response: Portfolio[]) => {
				return {
					props: {
						portfolios: response,
					},
				};
			});
	}
</script>

<script lang="ts">
	import { Button, Table } from "sveltestrap";
	import { base } from "$app/paths";
	import type { Portfolio } from "$lib/portfolio";
	import PortfolioDetail from "$lib/PortfolioDetail.svelte";
	import { file } from "$lib/global";
	import { number } from "svelte-i18n";
	export let portfolios: Portfolio[] = [];

	let numberLocale = /*Intl.NumberFormat().resolvedOptions().locale*/ "de";

	// TODO: fetch this from the portfolio API
	let currency = "EUR";

	let selectedPortfolio = portfolios[0] ?? null;
</script>

<h3>Portfolios</h3>

<Table hover striped borderless size="sm">
	<thead>
		<td class="first">Name</td>
		<td>Reference Account</td>
		<td>Volume</td>
		<td>Actions</td>
	</thead>
	<tbody>
		{#each portfolios as portfolio, index}
			<tr>
				<td class="first">{portfolio.name}</td>
				<td>TBD</td>
				<td>
					{$number(portfolio.snapshotValue.amount / 100.0, {
						locale: numberLocale,
						style: "currency",
						currency: currency,
					})}
				</td>
				<td class="last" />
			</tr>
		{/each}
	</tbody>
</Table>

{#if selectedPortfolio}
	<PortfolioDetail portfolio={selectedPortfolio} />
{/if}

<style>
	/* TODO: somehow does not work in app.css */
	table tbody tr:hover td {
		color: white;
	}
</style>
