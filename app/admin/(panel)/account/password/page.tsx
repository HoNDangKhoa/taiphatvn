import { AccountForm } from "@/components/admin/AccountForm";
import { readSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function PasswordPage() {
  const session = await readSession();
  if (!session) redirect("/admin/login");
  return <AccountForm name={session.name} />;
}
