import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { signUpAction } from "@/app/actions/auth";
export const metadata: Metadata = { title: "Create account" };
export default function SignupPage() { return <AuthForm mode="signup" action={signUpAction} />; }
