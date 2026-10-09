import type { Metadata } from "next";
import { ProductForm } from "@/components/product-form";
import { createProductAction } from "@/app/actions/products";
export const metadata: Metadata = { title: "Add product" };
export default function NewProductPage() { return <main className="content-shell"><div className="page-title-row"><div><span className="page-eyebrow">Build your product economics</span><h1 className="page-title">Add a product</h1><p className="page-subtitle">Enter per-unit revenue, costs, and estimated fees.</p></div></div><ProductForm mode="create" action={createProductAction} cancelHref="/products" /></main>; }
