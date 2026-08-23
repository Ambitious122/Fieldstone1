import type { Money } from "@/types/shopify";

export function formatMoney(money: Money): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode,
  }).format(parseFloat(money.amount));
}

export function isOnSale(price: Money, compareAt: Money): boolean {
  return parseFloat(compareAt.amount) > parseFloat(price.amount);
}

export function discountPercent(price: Money, compareAt: Money): number {
  const p = parseFloat(price.amount);
  const c = parseFloat(compareAt.amount);
  if (c <= p) return 0;
  return Math.round(((c - p) / c) * 100);
}
