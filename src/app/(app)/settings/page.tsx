import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
export const metadata: Metadata = { title: "Settings" };
export default async function SettingsPage() {
  const { user } = await requireUser();
  return <main className="content-shell"><div className="page-title-row"><div><span className="page-eyebrow">Your account</span><h1 className="page-title">Settings</h1><p className="page-subtitle">Basic account information and app details.</p></div></div><section className="settings-card"><h2>Profile</h2><div className="settings-row"><span>Email</span><strong>{user.email ?? "Not available"}</strong></div><div className="settings-row"><span>Account ID</span><strong>{user.id.slice(0, 8)}…</strong></div><p className="settings-help">Your products are private to your account. Sign out from the top navigation when you are done.</p></section><section className="settings-card" style={{ marginTop: 14 }}><h2>About Marketplace Profit Clarity</h2><p className="settings-help">This tool estimates per-unit profit from the values you enter. Marketplace fee presets are editable examples, not official rates. Confirm fees with your platform before making pricing decisions.</p></section></main>;
}
