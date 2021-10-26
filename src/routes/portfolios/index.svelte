<script lang="ts" context="module">
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	interface DepotEntry {
		price: any;
		buyPrice: any;
		profit: any;
		profitPercentage: any;
		quantity: any;
		isin: string;
		name: string;
	}
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
	export let portfolios: Portfolio[] = [];

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
				<td>{(portfolio.snapshotValue.amount / 100.0).toFixed(2)} €</td>
				<td class="last" />
			</tr>
		{/each}
	</tbody>
</Table>

{#if selectedPortfolio}
	<PortfolioDetail portfolio={selectedPortfolio} />
{/if}

<style>
	thead td {
		color: gray;
		font-weight: bold;
		font-size: small;
		padding-bottom: 0.5rem;
	}

	thead td.first {
		padding-left: 0.75rem;
	}

	tbody td.first {
		border-top-left-radius: 6px;
		border-bottom-left-radius: 6px;
		padding-left: 0.75rem;
	}

	tbody td.last {
		border-top-right-radius: 6px;
		border-bottom-right-radius: 6px;
	}

	h3 {
		font-weight: 600;
	}

	table tbody tr:hover {
		background: #336f90;
	}

	table tbody tr:hover td {
		color: white;
	}
</style>
