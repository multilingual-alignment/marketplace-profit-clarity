import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
export async function requireUser() {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}
export function safeNextPath(value: string | null | undefined): string { return value && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard"; }
