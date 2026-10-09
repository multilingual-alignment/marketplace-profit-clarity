import { createClient } from "@/lib/supabase/server";
import { calculateProduct, type ProductRecord } from "@/lib/products";
function csvCell(value: string | number | boolean | null): string {
  let text = value === null ? "" : String(value);
  if (typeof value === "string" && /^[=+@\-\t\r]/.test(text)) text = "'" + text;
  return '"' + text.replace(/"/g, '""') + '"';
}
export async function GET() {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  const { data, error } = await supabase.from("products").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
  if (error) return new Response("Could not export products.", { status: 500 });
  const headers = ["name", "platform_preset", "currency_code", "selling_price", "shipping_charged_to_customer", "product_cost", "packaging_cost", "labor_cost_input", "labor_minutes", "labor_hourly_rate", "shipping_cost_seller", "platform_fee_percent", "platform_fee_fixed", "payment_fee_percent", "payment_fee_fixed", "listing_fee", "advertising_cost_per_unit", "returns_allowance_percent", "returns_allowance_fixed", "tax_enabled", "tax_rate_percent", "calculated_labor_cost", "total_revenue", "total_costs", "net_profit_per_unit", "profit_margin_percent", "markup_percent", "break_even_selling_price", "target_price_10_profit", "target_price_30_margin"];
  const rows = (data as ProductRecord[]).map((product) => { const calc = calculateProduct(product); return [product.name, product.platform_preset, product.currency_code, product.selling_price, product.shipping_charged_to_customer, product.product_cost, product.packaging_cost, product.labor_cost, product.labor_minutes, product.labor_hourly_rate, product.shipping_cost_seller, product.platform_fee_percent, product.platform_fee_fixed, product.payment_fee_percent, product.payment_fee_fixed, product.listing_fee, product.advertising_cost_per_unit, product.returns_allowance_percent, product.returns_allowance_fixed, product.tax_enabled, product.tax_rate_percent, calc.laborCost, calc.totalRevenue, calc.totalCosts, calc.netProfit, calc.marginPercent, calc.markupPercent, calc.breakEvenPrice, calc.targetPriceByProfit, calculateProduct(product, 10, 30).targetPriceByMargin]; });
  const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
  return new Response(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="marketplace-profit-clarity-products.csv"', "Cache-Control": "private, no-store" } });
}
