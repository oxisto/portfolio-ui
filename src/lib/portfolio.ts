import type { SecurityPerformanceRecord, SecurityPosition } from "./security";

export interface Portfolio {
    name: string
    uuid: string
    snapshotValue: Money
}

export interface AssetElement {
    position: SecurityPosition
    classification: string
    valuation: Money
    performance: SecurityPerformanceRecord
}

export interface Money {
    currencyCode: string
    amount: number
}
