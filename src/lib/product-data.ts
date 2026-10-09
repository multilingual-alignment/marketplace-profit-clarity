import { notFound, redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import type { ProductRecord } from "./products";
export async function getUserProducts(): Promise<ProductRecord[]> {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data, error } = await supabase.from("products").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
  if (error) throw new Error("Could not load products. Check your Supabase setup and try again.");
  return (data ?? []) as ProductRecord[];
}
export async function getUserProduct(id: string): Promise<ProductRecord> {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data, error } = await supabase.from("products").select("*").eq("id", id).eq("user_id", user.id).maybeSingle();
  if (error) throw new Error("Could not load this product.");
  if (!data) notFound();
  return data as ProductRecord;
}
