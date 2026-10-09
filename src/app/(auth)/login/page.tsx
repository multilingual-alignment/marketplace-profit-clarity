import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { signInAction } from "@/app/actions/auth";
export const metadata: Metadata = { title: "Sign in" };
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const params = await searchParams;
  return <AuthForm mode="login" action={signInAction} nextPath={params.next ?? "/dashboard"} />;
}
