"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { validateProductFormData } from "@/lib/validation";
export type ProductActionState = { error: string } | null;
async function getAuthenticatedClient() {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}
export async function createProductAction(_previous: ProductActionState, formData: FormData): Promise<ProductActionState> {
  const parsed = validateProductFormData(formData); if (!parsed.success) return { error: parsed.message };
  const { supabase, user } = await getAuthenticatedClient();
  const { error } = await supabase.from("products").insert({ ...parsed.data, user_id: user.id });
  if (error) return { error: "Product could not be saved. Check the Supabase migration and try again." };
  revalidatePath("/dashboard"); revalidatePath("/products"); redirect("/products");
}
export async function updateProductAction(id: string, _previous: ProductActionState, formData: FormData): Promise<ProductActionState> {
  const parsed = validateProductFormData(formData); if (!parsed.success) return { error: parsed.message };
  const { supabase, user } = await getAuthenticatedClient();
  const { data, error } = await supabase.from("products").update(parsed.data).eq("id", id).eq("user_id", user.id).select("id").maybeSingle();
  if (error) return { error: "Product could not be updated. Check the values and try again." };
  if (!data) return { error: "Product not found or you do not have access to it." };
  revalidatePath("/dashboard"); revalidatePath("/products"); revalidatePath("/products/" + id); redirect("/products/" + id);
}
export async function deleteProductAction(id: string, _formData: FormData) {
  void _formData;
  const { supabase, user } = await getAuthenticatedClient();
  const { error } = await supabase.from("products").delete().eq("id", id).eq("user_id", user.id);
  if (error) throw new Error("Product could not be deleted. Try again.");
  revalidatePath("/dashboard"); revalidatePath("/products"); redirect("/products");
}
