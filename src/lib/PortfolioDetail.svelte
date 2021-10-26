<script lang="ts">
    import { onMount } from "svelte";

    import { Table } from "sveltestrap";
    import { number } from "svelte-i18n";

    import type { Portfolio, PortfolioSnapshot } from "./portfolio";
    import type { SecurityPosition } from "./security";
    import { file } from "./global";

    export let portfolio: Portfolio;

    let snapshot: PortfolioSnapshot;
    let totalMarketValue: number = 0;
    let totalProfit = 0;

    let numberLocale = /*Intl.NumberFormat().resolvedOptions().locale*/ "de";

    // TODO: fetch this from the portfolio API
    let currency = "EUR";

    onMount(async () => {
        const apiUrl = `/api/v0/portfolios/${portfolio.uuid}/assets`;
        return fetch(apiUrl, {
            headers: {
                "x-pp-token": "mytoken",
                "x-pp-file": file,
            },
        })
            .then((res) => res.json())
            .then((response: PortfolioSnapshot) => {
                snapshot = response;

                totalMarketValue = calculateTotalMarketValue(
                    snapshot.positions
                );
                totalProfit = calculateTotalProfit(snapshot.positions);
            });
    });

    function calculateTotalMarketValue(positions: SecurityPosition[]): number {
        var total = 0;

        for (let position of positions) {
            total += (position.price.value / 100000000.0) * position.shares;
        }

        return total;
    }

    function calculateTotalProfit(positions: SecurityPosition[]): number {
        var total = 0;

        for (let position of positions) {
            total += position.record.capitalGainsOnHoldings.amount / 100.0;
        }

        return total;
    }
</script>

{#if snapshot}
    <div id="details">
        <h5>{portfolio.name}</h5>

        <div
            class="container"
            style="width: max-content; margin-left: 0; margin-right: 0; padding-left: 0"
        >
            <div class="row">
                <div class="col-sm">
                    <div class="market-value-title">Total Market Value</div>

                    <div class="market-value">
                        {$number(totalMarketValue, {
                            locale: numberLocale,
                            style: "currency",
                            currency: "EUR",
                        })}
                    </div>
                </div>
                <div class="col-sm">
                    <div class="market-value-title">Total Profit / Loss</div>

                    <div
                        class={totalProfit < 0 ? "total-loss" : "total-profit"}
                    >
                        {$number(totalProfit, {
                            locale: numberLocale,
                            style: "currency",
                            currency: "EUR",
                        })}
                    </div>
                </div>
            </div>
        </div>

        <Table hover striped borderless size="sm mt-4">
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
                {#each snapshot.positions as position, index}
                    <tr>
                        <td width="500" class="first"
                            >{position.investment.name}</td
                        >
                        <td>{position.shares}</td>
                        <td>{position.investment.ticker}</td>
                        <td>
                            {$number(
                                position.record.fifoCostPerSharesHeld.amount /
                                    100000000.0,
                                {
                                    locale: numberLocale,
                                    style: "currency",
                                    currency: currency,
                                }
                            )}
                        </td>
                        <td>
                            {$number(position.price.value / 100000000.0, {
                                locale: numberLocale,
                                style: "currency",
                                currency: currency,
                            })}
                        </td>
                        <td
                            >{$number(
                                (position.price.value / 100000000.0) *
                                    position.shares,
                                {
                                    locale: numberLocale,
                                    style: "currency",
                                    currency: currency,
                                }
                            )}
                        </td>
                        <td style="text-align: right;">
                            <div
                                class={position.record.capitalGainsOnHoldings
                                    .amount < 0
                                    ? "loss"
                                    : "profit"}
                            >
                                {$number(
                                    position.record.capitalGainsOnHoldings
                                        .amount / 100.0,
                                    {
                                        locale: numberLocale,
                                        style: "currency",
                                        currency: currency,
                                    }
                                )}
                            </div>
                        </td>
                        <td class="last" />
                    </tr>
                {/each}
            </tbody>
        </Table>
    </div>
{/if}

<style>
    #details {
        margin-top: 3rem;
        border-left-width: 5px;
        border-left-color: #336f90;
        border-left-style: solid;
        padding-left: 1rem;
    }

    /* TODO: somehow does not work in app.css */
    table tbody tr:hover td {
        color: white;
    }

    .profit {
        background-color: #d8edc7;
        color: #20490c;
        border-radius: 4px;
        padding-right: 0.5rem;
    }

    .loss {
        background-color: #f9cfc5;
        color: #601c0c;
        border-radius: 4px;
        padding-right: 0.5rem;
    }

    .market-value {
        background: #cde3ef;
        border-radius: 4px;
        width: max-content;
        display: block;
        text-align: center;
        font-size: 1.2rem;
        font-weight: 700;
        color: #26526b;
        padding: 0.5rem 2rem 0.5rem 2rem;
    }

    .total-profit {
        background: #d8edc7;
        border-radius: 4px;
        width: max-content;
        display: block;
        text-align: center;
        font-size: 1.2rem;
        font-weight: 700;
        color: #20490c;
        padding: 0.5rem 2rem 0.5rem 2rem;
    }

    .total-loss {
        background: #f9cfc5;
        border-radius: 4px;
        width: max-content;
        display: block;
        text-align: center;
        font-size: 1.2rem;
        font-weight: 700;
        color: #601c0c;
        padding: 0.5rem 2rem 0.5rem 2rem;
    }

    .market-value-title {
        color: gray;
        font-weight: bold;
        font-size: small;
        padding-bottom: 0.5rem;
    }
</style>
