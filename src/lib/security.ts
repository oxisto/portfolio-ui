export interface Investment {
    name: string;
}

export interface Security extends Investment {
    isin: string;
    ticker: string;
    latest: LatestSecurityPrice;
    date: string;
}

export interface LatestSecurityPrice {
    high: number;
    low: number;
    value: number;
    volume: number;
}

export interface SecurityPosition {
    investment: /*Investment*/Security
    price: SecurityPrice
    shares: number
}

export interface SecurityPrice {
    date: string
    value: number
}