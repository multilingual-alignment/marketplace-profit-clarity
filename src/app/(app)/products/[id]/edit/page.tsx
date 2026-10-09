import type { Metadata } from "next";
import { ProductForm } from "@/components/product-form";
import { updateProductAction } from "@/app/actions/products";
import { getUserProduct } from "@/lib/product-data";
export const metadata: Metadata = { title: "Edit product" };
export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const product = await getUserProduct(id); const action = updateProductAction.bind(null, id);
  return <main className="content-shell"><div className="page-title-row"><div><span className="page-eyebrow">Update your assumptions</span><h1 className="page-title">Edit product</h1><p className="page-subtitle">Changes update the profit and pricing preview.</p></div></div><ProductForm mode="edit" product={product} action={action} cancelHref={"/products/" + id} /></main>;
}
