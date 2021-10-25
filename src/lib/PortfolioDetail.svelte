<script lang="ts">
import { onMount } from "svelte";

import { Table } from "sveltestrap";

    import type { Portfolio, PortfolioSnapshot } from "./portfolio";
import type { SecurityPosition, Security } from "./security";

    export let portfolio: Portfolio
    let entries: SecurityPosition[] = [];

    onMount(async () => {
		const apiUrl = `/api/v0/portfolios/${portfolio.uuid}/assets`;
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

    function profitOrLoss(position: SecurityPosition): string {
        if(position.record.capitalGainsOnHoldings.amount < 0) {
            return "loss";
        } else {
            return "profit";
        }
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

    .profit {
        background-color: #D8EDC7;
        color: #20490C;
        border-radius: 4px;
        padding-right: 0.5rem;
    }

    .loss {
        background-color: #F9CFC5;
        color: #601C0C;
        border-radius: 4px;
        padding-right: 0.5rem;
    }
</style>

<div id="details">
    <h5>{portfolio.name}</h5>

    <div class="grey-bold">Total market value</div>

    <div style="background: #CDE3EF;
    border-radius: 4px; width: 100px">1233 €
</div>

    <Table hover striped borderless size="sm">
        <thead>
            <td class="first">Name</td>
            <td>Shares</td>
            <td>Symbol</td>
            <td>Purchase Price</td>
            <td>Quote</td>
            <td>Market Value</td>
            <td style="text-align: right;">Profit / Loss</td>
            <td>Actions</td>
        </thead>
	<tbody>
		{#each entries as entry, index}
			<tr>
                <td width="500">{entry.investment.name}</td>
				<td>{entry.shares}</td>
                <td>{entry.investment.ticker}</td>
                <td>{(entry.record.fifoCostPerSharesHeld.amount / 100000000.0).toFixed(2)} €</td>
                <td>{(entry.price.value / 100000000.0).toFixed(2)} €</td>
                <td>{(entry.price.value / 100000000.0 * entry.shares).toFixed(2)} €</td>
                <td style="text-align: right;">
                    <div class="{profitOrLoss(entry)}">
                        {(entry.record.capitalGainsOnHoldings.amount / 100.0).toFixed(2)} €
                    </div>
                </td>
			</tr>
		{/each}
	</tbody>
</Table>
</div>