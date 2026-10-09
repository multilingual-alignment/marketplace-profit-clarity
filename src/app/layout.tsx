import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: { default: "Marketplace Profit Clarity", template: "%s · Marketplace Profit Clarity" }, description: "See the real profit behind every product after fees, shipping, advertising, packaging, labor, and more." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
