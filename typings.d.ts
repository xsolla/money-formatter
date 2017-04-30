declare module "money-formatter" {
  export function formatSimple(currencyName: string, amount: number, fractionSize?: number): string
  export function format (currencyCode: string, amount: number, fractionSize?: number, useAlphaCode?: boolean): string
  export function formatToHTML (currencyCode: string, amount: number, fractionSize?: number, useAlphaCode?: boolean): string
}