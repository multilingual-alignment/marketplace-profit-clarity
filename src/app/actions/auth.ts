"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/auth";
export type AuthActionState = { error?: string; message?: string } | null;
export async function signInAction(_previous: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim(); const password = String(formData.get("password") ?? "");
  const supabase = await createClient(); const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Email or password was not accepted. Check the details and try again." };
  redirect(safeNextPath(String(formData.get("next") ?? "")));
}
export async function signUpAction(_previous: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim(); const password = String(formData.get("password") ?? "");
  if (password.length < 8) return { error: "Use a password with at least 8 characters." };
  const supabase = await createClient(); const requestOrigin = (await headers()).get("origin");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || requestOrigin || "http://localhost:3000";
  const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: siteUrl + "/auth/callback?next=%2Fdashboard" } });
  if (error) return { error: error.message };
  if (data.session) redirect("/dashboard");
  return { message: "Account created. Check your email to confirm your address, then sign in." };
}
export async function signOutAction() { const supabase = await createClient(); await supabase.auth.signOut(); redirect("/"); }
