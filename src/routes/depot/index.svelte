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
        isin: string,
        name: string
    }
	export async function load({ page, fetch, session, context }) {
        const apiUrl = "/v1/depot"
		return fetch(apiUrl)
        .then((res) => res.json())
        .then((response: DepotEntry[]) => {
            return {
					props: {
						entries: response
					}
				};
        });
        
	}
</script>

<script lang="ts">
	import { Button, Table } from 'sveltestrap';
	import { base } from '$app/paths';
	export let entries: DepotEntry[] = [];
</script>

<Table hover>
	<tbody>
		{#each entries as entry, index}
			<tr>
				<td><b>{entry.name}</b><br /><code>{entry.isin}</code></td>
				<td>{entry.quantity}</td>
				<td>{entry.buyPrice.toFixed(2)} €</td>
                <td>{entry.price.toFixed(2)} €</td>
				<td>
					<span>
						{entry.profit.toFixed(2)} € ({(entry.profitPercentage*100).toFixed(2)} %)
					</span>
				</td>
			</tr>
		{/each}
	</tbody>
</Table>