<script lang="ts">
    import { onMount } from "svelte";

    import { Table } from "sveltestrap";
    import { number } from "svelte-i18n";

    import type { AssetElement, Portfolio } from "./portfolio";
    import type { LatestSecurityPrice, SecurityPosition } from "./security";
    import { file } from "./global";
    import type { Taxonomy } from "./taxonomy";

    export let portfolio: Portfolio;

    let elements: AssetElement[] = null;
    let totalMarketValue: number = 0;
    let totalProfit = 0;

    let numberLocale = /*Intl.NumberFormat().resolvedOptions().locale*/ "de";

    //let taxonomies = await fetchTaxonomies();
    fetchTaxonomies();

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
            .then((response: AssetElement[]) => {
                // filter out positions for now, we will deal with categories later
                elements = response.filter((e) => e.position != null);
            });
    }

    // react if snapshot changes
    $: if (elements) {
        totalMarketValue = calculateTotalMarketValue(elements);
        totalProfit = calculateTotalProfit(elements);
        elements = elements.sort(sortFunction);
    }

    function sortFunction(a: AssetElement, b: AssetElement): number {
        return a.position.investment.name.toLowerCase() >
            b.position.investment.name.toLowerCase()
            ? 1
            : -1;
    }

    function calculateTotalMarketValue(positions: AssetElement[]): number {
        var total = 0;

        for (let position of positions) {
            total += position.performance.marketValue.amount / 100.0;
        }

        return total;
    }

    function calculateTotalProfit(positions: AssetElement[]): number {
        var total = 0;

        for (let position of positions) {
            total += position.performance.capitalGainsOnHoldings.amount / 100.0;
        }

        return total;
    }

    async function fetchTaxonomies(): Promise<Taxonomy[]> {
        const apiUrl = `/api/v0/taxonomies`;
        return fetch(apiUrl, {
            headers: {
                "x-pp-token": "mytoken",
                "x-pp-file": $file,
            },
        })
            .then((res) => res.json())
            .then((response: Taxonomy[]) => {
                return response;
            });
    }
</script>

{#if elements}
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
                {#each elements as element, index}
                    <tr>
                        <td width="500">{element.position.investment.name}</td>
                        <td>{element.position.shares}</td>
                        <td>{element.position.investment.ticker ?? ""}</td>
                        <td>
                            {$number(
                                element.performance.fifoCostPerSharesHeld
                                    .amount / 100000000.0,
                                {
                                    locale: numberLocale,
                                    style: "currency",
                                    currency:
                                        element.performance
                                            .fifoCostPerSharesHeld.currencyCode,
                                }
                            )}
                        </td>
                        <td>
                            {$number(
                                element.position.investment.latest.value /
                                    100000000.0,
                                {
                                    locale: numberLocale,
                                    style: "currency",
                                    currency:
                                        element.performance.quote.currencyCode,
                                }
                            )}
                        </td>
                        <td>
                            {$number(
                                element.performance.marketValue.amount / 100.0,
                                {
                                    locale: numberLocale,
                                    style: "currency",
                                    currency:
                                        element.performance.marketValue
                                            .currencyCode,
                                }
                            )}
                        </td>
                        <td style="text-align: right;">
                            <div
                                class={element.performance
                                    .capitalGainsOnHoldings.amount < 0
                                    ? "loss"
                                    : "profit"}
                            >
                                {$number(
                                    element.performance.capitalGainsOnHoldings
                                        .amount / 100.0,
                                    {
                                        locale: numberLocale,
                                        style: "currency",
                                        currency:
                                            element.performance
                                                .capitalGainsOnHoldings
                                                .currencyCode,
                                    }
                                )}
                            </div>
                        </td>
                        <td />
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
