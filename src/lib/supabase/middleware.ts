import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
export async function updateSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL; const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return NextResponse.next({ request });
  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, anonKey, { cookies: {
    getAll() { return request.cookies.getAll(); },
    setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
      cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
      response = NextResponse.next({ request });
      cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
    },
  } });
  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname; const protectedPrefixes = ["/dashboard", "/products", "/settings", "/export.csv"];
  const protectedPath = protectedPrefixes.some((prefix) => path === prefix || path.startsWith(prefix + "/"));
  if (!user && protectedPath) { const target = request.nextUrl.clone(); target.pathname = "/login"; target.searchParams.set("next", path); return NextResponse.redirect(target); }
  if (user && (path === "/login" || path === "/signup")) return NextResponse.redirect(new URL("/dashboard", request.url));
  return response;
}
