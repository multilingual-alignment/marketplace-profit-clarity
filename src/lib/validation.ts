import { z } from "zod";
import { CURRENCY_OPTIONS, PLATFORM_OPTIONS, type ProductFields } from "./products";
const money = z.number().finite().min(0).max(1000000000);
const percentage = z.number().finite().min(0).max(100);
const productSchema = z.object({
  name: z.string().trim().min(1, "Enter a product name.").max(120, "Product names must be 120 characters or fewer."),
  platform_preset: z.enum(PLATFORM_OPTIONS.map((item) => item.value) as ["etsy", "shopify", "ebay", "amazon", "custom"]),
  currency_code: z.enum(CURRENCY_OPTIONS.map((item) => item.value) as ["USD", "EUR", "GBP", "CAD", "AUD"]),
  selling_price: money, shipping_charged_to_customer: money, product_cost: money, packaging_cost: money, labor_cost: money,
  labor_minutes: z.number().finite().min(0).max(1000000).nullable(), labor_hourly_rate: money.nullable(), shipping_cost_seller: money,
  platform_fee_percent: percentage, platform_fee_fixed: money, payment_fee_percent: percentage, payment_fee_fixed: money, listing_fee: money, advertising_cost_per_unit: money,
  returns_allowance_percent: percentage, returns_allowance_fixed: money, tax_enabled: z.boolean(), tax_rate_percent: percentage,
});
function readNumber(formData: FormData, key: string): number { const raw = String(formData.get(key) ?? "").trim(); return raw === "" ? 0 : Number(raw); }
function readOptionalNumber(formData: FormData, key: string): number | null { const raw = String(formData.get(key) ?? "").trim(); return raw === "" ? null : Number(raw); }
export function validateProductFormData(formData: FormData): { success: true; data: ProductFields } | { success: false; message: string } {
  const result = productSchema.safeParse({
    name: String(formData.get("name") ?? ""), platform_preset: String(formData.get("platform_preset") ?? ""), currency_code: String(formData.get("currency_code") ?? ""),
    selling_price: readNumber(formData, "selling_price"), shipping_charged_to_customer: readNumber(formData, "shipping_charged_to_customer"), product_cost: readNumber(formData, "product_cost"), packaging_cost: readNumber(formData, "packaging_cost"), labor_cost: readNumber(formData, "labor_cost"),
    labor_minutes: readOptionalNumber(formData, "labor_minutes"), labor_hourly_rate: readOptionalNumber(formData, "labor_hourly_rate"), shipping_cost_seller: readNumber(formData, "shipping_cost_seller"),
    platform_fee_percent: readNumber(formData, "platform_fee_percent"), platform_fee_fixed: readNumber(formData, "platform_fee_fixed"), payment_fee_percent: readNumber(formData, "payment_fee_percent"), payment_fee_fixed: readNumber(formData, "payment_fee_fixed"), listing_fee: readNumber(formData, "listing_fee"), advertising_cost_per_unit: readNumber(formData, "advertising_cost_per_unit"),
    returns_allowance_percent: readNumber(formData, "returns_allowance_percent"), returns_allowance_fixed: readNumber(formData, "returns_allowance_fixed"), tax_enabled: formData.get("tax_enabled") === "on", tax_rate_percent: readNumber(formData, "tax_rate_percent"),
  });
  if (!result.success) return { success: false, message: result.error.issues[0]?.message ?? "Check the values and try again." };
  return { success: true, data: result.data };
}
