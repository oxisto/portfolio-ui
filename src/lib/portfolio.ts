import type { SecurityPosition } from "./security";

export interface Portfolio {
    name: string
    uuid: string
    snapshotValue: Money
}

export interface PortfolioSnapshot {
    portfolioId: string
    positions: SecurityPosition[]
}

export interface Money {
    currencyCode: string
    amount: number
}
