<script lang="ts" context="module">
    import type { Security } from "$lib/security";
    import { file } from "$lib/global";
    import { get } from "svelte/store";

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
        const apiUrl = "/api/v0/securities";
        return fetch(apiUrl, {
            headers: {
                "x-pp-token": "mytoken",
                "x-pp-file": get(file),
            },
        })
            .then((res) => res.json())
            .then((response: Security[]) => {
                return {
                    props: {
                        securities: response,
                    },
                };
            });
    }
</script>

<script lang="ts">
    import { Button, Table } from "sveltestrap";
    import { base } from "$app/paths";
    export let securities: Security[] = [];
</script>

<Table hover>
    <tbody>
        {#each securities as security, index}
            <tr>
                <td><b>{security.name}</b><br /><code>{security.isin}</code></td
                >
                <td
                    >{(security.latest?.value / 100000000.0).toFixed(2)} €<br
                    /><code>{security.latest?.date}</code></td
                >
            </tr>
        {/each}
    </tbody>
</Table>
