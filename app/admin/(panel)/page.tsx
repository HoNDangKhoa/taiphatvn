import { Suspense } from "react";
import Link from "next/link";
import { AdminCard, AdminPageHeader } from "@/components/admin/AdminChrome";
import { DashboardAnalyticsPanel, QuickLinkCards } from "@/components/admin/DashboardAnalytics";
import { getDashboardAnalytics } from "@/lib/analytics";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const sp = await searchParams;
  const month = Number(sp.month) || undefined;
  const year = Number(sp.year) || undefined;
  const [analytics, recent] = await Promise.all([
    getDashboardAnalytics(month, year),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);
  return (
    <div>
      <AdminPageHeader title="Bảng điều khiển" />
      <QuickLinkCards />
      <Suspense>
        <DashboardAnalyticsPanel initial={analytics} />
      </Suspense>
      <div className="mt-6">
        <AdminCard title="Đơn mới">
          {recent.length === 0 ? <p className="text-sm text-ink/50">Chưa có đơn.</p> : (
            <ul className="space-y-2 text-sm">
              {recent.map((o) => (
                <li key={o.id}>
                  <Link href={`/admin/orders/${o.id}`} className="font-semibold text-[#3f7d3a]">{o.code}</Link>
                  <span className="text-ink/60"> — {o.fullName} · {o.phone} · {o.status}</span>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
