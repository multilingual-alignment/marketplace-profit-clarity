import { productStatus } from "@/lib/products";
export function StatusBadge({ profit }: { profit: number }) { const status = productStatus(profit); const label = status === "profitable" ? "Profitable" : status === "break-even" ? "Break-even" : "Loss-making"; return <span className={"status-badge status-" + status}>{label}</span>; }
