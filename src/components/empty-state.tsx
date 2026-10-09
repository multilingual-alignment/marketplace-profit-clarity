import Link from "next/link";
export function EmptyState({ title = "No products yet", description = "Add a product to see what remains after fees, shipping, labor, and your other costs.", href = "/products/new", buttonLabel = "Add your first product" }: { title?: string; description?: string; href?: string; buttonLabel?: string }) {
  return <div className="empty-state"><div className="empty-icon" aria-hidden="true">＋</div><h2>{title}</h2><p>{description}</p><Link className="button button-primary" href={href}>{buttonLabel} <span aria-hidden="true">→</span></Link></div>;
}
