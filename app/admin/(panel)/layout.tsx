import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { logout } from "@/lib/actions";
import { readSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await readSession();
  if (!session) redirect("/admin/login");
  return (
    <AdminShell userName={session.name} userInitial={session.name.charAt(0).toUpperCase()} signOutAction={logout}>
      {children}
    </AdminShell>
  );
}
