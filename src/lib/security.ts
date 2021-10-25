import type { Money } from "./portfolio";

export interface Investment {
    name: string;
}

export interface Security extends Investment {
    isin: string;
    ticker: string;
    latest: LatestSecurityPrice;
}

export interface LatestSecurityPrice {
    high: number;
    low: number;
    value: number;
    volume: number;
    date: string;
}

export interface Quote {
    amount: number;
    currencyCode: string;
}

export interface SecurityPerformanceRecord {
    fifoCostPerSharesHeld: Quote
    capitalGainsOnHoldings: Money
}

export interface SecurityPosition {
    investment: /*Investment*/Security
    price: SecurityPrice
    shares: number
    record: SecurityPerformanceRecord
}

export interface SecurityPrice {
    date: string
    value: number
}