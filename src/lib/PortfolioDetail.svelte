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

    // react if portfolio.uuid changes
    $: {
        console.log("portfolio uuid changed");

        const apiUrl = `/api/v0/portfolios/${portfolio.uuid}/assets`;
        fetch(apiUrl, {
            headers: {
                "x-pp-token": "mytoken",
                "x-pp-file": $file,
            },
        })
            .then((res) => res.json())
            .then((response: PortfolioSnapshot) => {
                snapshot = response;
            });
    }

    // react if snapshot changes
    $: if (snapshot) {
        totalMarketValue = calculateTotalMarketValue(snapshot.positions);
        totalProfit = calculateTotalProfit(snapshot.positions);
        snapshot.positions = snapshot.positions.sort(sortFunction);
    }

    function sortFunction(a: SecurityPosition, b: SecurityPosition): number {
        return a.investment.name.toLowerCase() > b.investment.name.toLowerCase()
            ? 1
            : -1;
    }

    function calculateTotalMarketValue(positions: SecurityPosition[]): number {
        var total = 0;

        for (let position of positions) {
            total += position.record.marketValue.amount / 100.0;
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
            style="width: max-content; margin-left: 0.75rem; margin-right: 0; padding-left: 0"
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
                <tr>
                    <th>Name</th>
                    <th>Shares</th>
                    <th>Symbol</th>
                    <th>Purchase Price</th>
                    <th>Quote</th>
                    <th>Market Value</th>
                    <th style="text-align: right;">Profit / Loss</th>
                    <th>Actions</th>
                </tr>
                <tr>
                    <td colspan="8">Equity</td>
                </tr>
            </thead>
            <tbody>
                {#each snapshot.positions as position, index}
                    <tr>
                        <td width="500">{position.investment.name}</td>
                        <td>{position.shares}</td>
                        <td>{position.investment.ticker}</td>
                        <td>
                            {$number(
                                position.record.fifoCostPerSharesHeld.amount /
                                    100000000.0,
                                {
                                    locale: numberLocale,
                                    style: "currency",
                                    currency:
                                        position.record.fifoCostPerSharesHeld
                                            .currencyCode,
                                }
                            )}
                        </td>
                        <td>
                            {$number(
                                position.record.quote.amount / 100000000.0,
                                {
                                    locale: numberLocale,
                                    style: "currency",
                                    currency:
                                        position.record.quote.currencyCode,
                                }
                            )}
                        </td>
                        <td>
                            {$number(
                                position.record.marketValue.amount / 100.0,
                                {
                                    locale: numberLocale,
                                    style: "currency",
                                    currency:
                                        position.record.marketValue
                                            .currencyCode,
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
                                        currency:
                                            position.record
                                                .capitalGainsOnHoldings
                                                .currencyCode,
                                    }
                                )}
                            </div>
                        </td>
                        <td class="last" />
                    </tr>
                {/each}
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="5">Total</td>
                    <td>
                        {$number(totalMarketValue, {
                            locale: numberLocale,
                            style: "currency",
                            currency: "EUR",
                        })}
                    </td>
                    <td style="text-align: right;">
                        <div class={totalProfit < 0 ? "loss" : "profit"}>
                            {$number(totalProfit, {
                                locale: numberLocale,
                                style: "currency",
                                currency: "EUR",
                            })}
                        </div>
                    </td>
                </tr>
            </tfoot>
        </Table>
    </div>
{/if}

<style>
    #details {
        margin-top: 3rem;
        border-left-color: #336f90;
        border-left-style: solid;

        /* since the css border is INSIDE the element, 
        this a little trick so that it looks like the 
        border is offset to the outside */
        border-left-width: 5px;
        margin-left: -15px;
        padding-left: 10px;
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
        padding-bottom: 0.5rem;
        font-size: small;
    }
</style>
