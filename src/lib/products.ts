export const PLATFORM_OPTIONS = [
  { value: "etsy", label: "Etsy" }, { value: "shopify", label: "Shopify" }, { value: "ebay", label: "eBay" }, { value: "amazon", label: "Amazon" }, { value: "custom", label: "Custom / Other" },
] as const;
export const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD ($)", locale: "en-US" }, { value: "EUR", label: "EUR (€)", locale: "de-DE" }, { value: "GBP", label: "GBP (£)", locale: "en-GB" }, { value: "CAD", label: "CAD (C$)", locale: "en-CA" }, { value: "AUD", label: "AUD (A$)", locale: "en-AU" },
] as const;
export type PlatformPreset = (typeof PLATFORM_OPTIONS)[number]["value"];
export type CurrencyCode = (typeof CURRENCY_OPTIONS)[number]["value"];
export type ProductFields = {
  name: string; platform_preset: PlatformPreset; currency_code: CurrencyCode;
  selling_price: number; shipping_charged_to_customer: number; product_cost: number; packaging_cost: number; labor_cost: number; labor_minutes: number | null; labor_hourly_rate: number | null;
  shipping_cost_seller: number; platform_fee_percent: number; platform_fee_fixed: number; payment_fee_percent: number; payment_fee_fixed: number; listing_fee: number; advertising_cost_per_unit: number;
  returns_allowance_percent: number; returns_allowance_fixed: number; tax_enabled: boolean; tax_rate_percent: number;
};
export type ProductRecord = ProductFields & { id: string; user_id: string; created_at: string; updated_at: string };
export const EMPTY_PRODUCT: ProductFields = {
  name: "", platform_preset: "etsy", currency_code: "USD", selling_price: 0, shipping_charged_to_customer: 0, product_cost: 0, packaging_cost: 0, labor_cost: 0, labor_minutes: null, labor_hourly_rate: null,
  shipping_cost_seller: 0, platform_fee_percent: 0, platform_fee_fixed: 0, payment_fee_percent: 0, payment_fee_fixed: 0, listing_fee: 0, advertising_cost_per_unit: 0, returns_allowance_percent: 0, returns_allowance_fixed: 0, tax_enabled: false, tax_rate_percent: 0,
};
export const FEE_PRESETS: Record<PlatformPreset, Partial<ProductFields>> = {
  etsy: { platform_fee_percent: 6.5, payment_fee_percent: 3, payment_fee_fixed: 0.25, listing_fee: 0.2 },
  shopify: { platform_fee_percent: 0, payment_fee_percent: 2.9, payment_fee_fixed: 0.3, listing_fee: 0 },
  ebay: { platform_fee_percent: 12.9, platform_fee_fixed: 0.3, payment_fee_percent: 0, payment_fee_fixed: 0, listing_fee: 0 },
  amazon: { platform_fee_percent: 15, platform_fee_fixed: 0, payment_fee_percent: 0, payment_fee_fixed: 0, listing_fee: 0 },
  custom: { platform_fee_percent: 0, platform_fee_fixed: 0, payment_fee_percent: 0, payment_fee_fixed: 0, listing_fee: 0 },
};
export type ProductCalculation = { totalRevenue: number; laborCost: number; platformFee: number; paymentFee: number; returnsAllowance: number; taxAmount: number; totalCosts: number; netProfit: number; marginPercent: number | null; markupPercent: number | null; breakEvenPrice: number; targetPriceByProfit: number; targetPriceByMargin: number | null };
export function calculateProduct(product: ProductFields, desiredProfit = 10, desiredMargin = 30): ProductCalculation {
  const totalRevenue = product.selling_price + product.shipping_charged_to_customer;
  const laborCost = product.labor_minutes !== null && product.labor_minutes > 0 && product.labor_hourly_rate !== null && product.labor_hourly_rate > 0 ? (product.labor_minutes / 60) * product.labor_hourly_rate : product.labor_cost;
  const platformFee = product.selling_price * product.platform_fee_percent / 100 + product.platform_fee_fixed;
  const paymentFee = product.selling_price * product.payment_fee_percent / 100 + product.payment_fee_fixed;
  const returnsAllowance = totalRevenue * product.returns_allowance_percent / 100 + product.returns_allowance_fixed;
  const taxAmount = product.tax_enabled ? totalRevenue * product.tax_rate_percent / 100 : 0;
  const totalCosts = product.product_cost + product.packaging_cost + laborCost + product.shipping_cost_seller + platformFee + paymentFee + product.listing_fee + product.advertising_cost_per_unit + returnsAllowance + taxAmount;
  const netProfit = totalRevenue - totalCosts;
  const marginPercent = totalRevenue === 0 ? null : netProfit / totalRevenue * 100;
  const markupPercent = totalCosts === 0 ? null : netProfit / totalCosts * 100;
  const safeProfit = Number.isFinite(desiredProfit) ? desiredProfit : 0;
  const targetPriceByMargin = desiredMargin >= 100 ? null : totalCosts / (1 - desiredMargin / 100);
  return { totalRevenue, laborCost, platformFee, paymentFee, returnsAllowance, taxAmount, totalCosts, netProfit, marginPercent, markupPercent, breakEvenPrice: totalCosts - product.shipping_charged_to_customer, targetPriceByProfit: totalCosts - product.shipping_charged_to_customer + safeProfit, targetPriceByMargin: targetPriceByMargin !== null && Number.isFinite(targetPriceByMargin) ? targetPriceByMargin : null };
}
export function productStatus(netProfit: number): "profitable" | "break-even" | "loss-making" {
  if (Math.abs(netProfit) < 0.005) return "break-even";
  return netProfit > 0 ? "profitable" : "loss-making";
}
export function formatCurrency(value: number | null, currency: CurrencyCode): string {
  if (value === null || !Number.isFinite(value)) return "N/A";
  const option = CURRENCY_OPTIONS.find((item) => item.value === currency) ?? CURRENCY_OPTIONS[0];
  return new Intl.NumberFormat(option.locale, { style: "currency", currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}
export function formatPercent(value: number | null): string { return value === null || !Number.isFinite(value) ? "N/A" : value.toFixed(2) + "%"; }
export function sortProducts(products: ProductRecord[], sort: string): ProductRecord[] {
  const sameCurrency = new Set(products.map((product) => product.currency_code)).size <= 1;
  const profitSort = sort === "highest_profit" || sort === "lowest_profit";
  if (profitSort && !sameCurrency) return products;
  return [...products].sort((a, b) => {
    const ca = calculateProduct(a); const cb = calculateProduct(b);
    if (sort === "highest_profit") return cb.netProfit - ca.netProfit;
    if (sort === "lowest_profit") return ca.netProfit - cb.netProfit;
    if (sort === "lowest_margin") return (ca.marginPercent ?? Number.POSITIVE_INFINITY) - (cb.marginPercent ?? Number.POSITIVE_INFINITY);
    return (cb.marginPercent ?? Number.NEGATIVE_INFINITY) - (ca.marginPercent ?? Number.NEGATIVE_INFINITY);
  });
}
export function canSortByProfit(products: ProductRecord[]): boolean { return new Set(products.map((product) => product.currency_code)).size <= 1; }
