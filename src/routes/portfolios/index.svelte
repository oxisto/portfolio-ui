<script lang="ts" context="module">
	import { file } from "$lib/global";
	import { get } from "svelte/store";

	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ page, fetch, session, context }) {
		const apiUrl = "/api/v0/portfolios";
		return fetch(apiUrl, {
			headers: {
				"x-pp-token": "mytoken",
				"x-pp-file": get(file),
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
	import { number } from "svelte-i18n";
	export let portfolios: Portfolio[] = [];

	let numberLocale = /*Intl.NumberFormat().resolvedOptions().locale*/ "de";

	let selectedPortfolio = portfolios[0] ?? null;
</script>

<h3>Portfolios</h3>

<Table hover striped borderless size="sm">
	<thead>
		<tr>
			<th>Name</th>
			<th>Reference Account</th>
			<th>Volume</th>
			<th>Actions</th>
		</tr>
	</thead>
	<tbody>
		{#each portfolios as portfolio, index}
			<tr>
				<td>{portfolio.name}</td>
				<td>TBD</td>
				<td>
					{$number(portfolio.snapshotValue.amount / 100.0, {
						locale: numberLocale,
						style: "currency",
						currency: portfolio.snapshotValue.currencyCode,
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
