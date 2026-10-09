import Link from "next/link";
import { calculateProduct, formatCurrency, formatPercent, type ProductRecord } from "@/lib/products";
import { StatusBadge } from "./status-badge";
export function ProductTable({ products }: { products: ProductRecord[] }) {
  return <div className="table-wrap"><table className="product-table"><thead><tr><th>Product</th><th>Platform</th><th>Currency</th><th>Selling price</th><th>Net profit / unit</th><th>Margin</th><th>Status</th></tr></thead><tbody>{products.map((product) => {
    const result = calculateProduct(product); const platform = product.platform_preset === "custom" ? "Custom / Other" : product.platform_preset.charAt(0).toUpperCase() + product.platform_preset.slice(1);
    return <tr key={product.id}><td><Link className="product-name-link" href={"/products/" + product.id}>{product.name}</Link></td><td>{platform}</td><td>{product.currency_code}</td><td className="numeric-cell">{formatCurrency(product.selling_price, product.currency_code)}</td><td className={"numeric-cell " + (result.netProfit < -0.005 ? "profit-negative" : "profit-positive")}>{formatCurrency(result.netProfit, product.currency_code)}</td><td className="numeric-cell">{formatPercent(result.marginPercent)}</td><td><StatusBadge profit={result.netProfit} /></td></tr>;
  })}</tbody></table></div>;
}
