export interface Portfolio {
    name: string
    uuid: string
    snapshotValue: Money
}

export interface Money {
    currencyCode: string
    amount: number
}