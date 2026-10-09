import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { signOutAction } from "@/app/actions/auth";
export default async function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user } = await requireUser();
  return <div className="app-shell"><header className="app-header"><div className="app-header-inner"><Link className="brand" href="/dashboard"><span className="brand-mark">MC</span><span>Marketplace Profit Clarity</span></Link><nav className="app-nav" aria-label="Main navigation"><Link href="/dashboard">Dashboard</Link><Link href="/products">Products</Link><Link href="/products/new">Add product</Link><Link href="/settings">Settings</Link></nav><div className="app-user-actions"><span className="app-user-email">{user.email}</span><form action={signOutAction}><button className="signout-button" type="submit">Sign out</button></form></div></div></header>{children}</div>;
}
