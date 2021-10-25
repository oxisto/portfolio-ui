<script lang="ts">
import { onMount } from "svelte";

import { Table } from "sveltestrap";

    import type { Portfolio, PortfolioSnapshot } from "./portfolio";
import type { SecurityPosition, Security } from "./security";

    export let portfolio: Portfolio
    let entries: SecurityPosition[] = [];

    onMount(async () => {
		const apiUrl = `/api/v0/portfolios/${portfolio.uuid}/snapshot`;
		return fetch(apiUrl, {
			headers: {
				"x-pp-token": "mytoken",
				"x-pp-file": "/Users/oxisto/depot.xml",
			},
		})
			.then((res) => res.json())
			.then((response: PortfolioSnapshot) => {
				entries = response.positions;
			});
	});

    function profit(position: SecurityPosition): number {
        let marketValue = position.investment.latest?.value / 100000000.0 * position.shares;
        let purchaseValue = position.price.value / 100000000.0 * position.shares;

        return marketValue - purchaseValue;
    }
</script>

<style>
    #details {
        margin-top: 3rem;
        border-left-width: 5px;
        border-left-color: #336F90;
        border-left-style: solid;
        padding-left: 1rem;
    }

    thead td {
		color: gray;
		font-weight: bold;
		font-size: small;
		padding-bottom: 0.5rem;
	}
</style>

<div id="details">
    <h5>{portfolio.name}</h5>

    <Table hover striped borderless size="sm">
        <thead>
            <td class="first">Name</td>
            <td>Shares</td>
            <td>Symbol</td>
            <td>Purchase Price</td>
            <td>Price</td>
            <td>Market Value</td>
            <td>Profit / Loss</td>
        </thead>
	<tbody>
		{#each entries as entry, index}
			<tr>
                <td>{entry.investment.name}</td>
				<td>{entry.shares}</td>
                <td>{entry.investment.ticker}</td>
                <td>{(entry.price.value / 100000000.0).toFixed(2)} €</td>
                <td>{(entry.investment.latest?.value / 100000000.0)?.toFixed(2)} €</td>
                <td>{(entry.investment.latest?.value / 100000000.0 * entry.shares)?.toFixed(2)} €</td>
                <td>{profit(entry)?.toFixed(2)} €</td>
			</tr>
		{/each}
	</tbody>
</Table>
</div>