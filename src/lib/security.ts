export interface Security {
    name: string;
    isin: string;
    latest: LatestSecurityPrice;
    date: string;
}

export interface LatestSecurityPrice {
    high: number;
    low: number;
    value: number;
    volume: number;
}