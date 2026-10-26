import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminCard, AdminPageHeader } from "@/components/admin/AdminChrome";

export default async function DashboardPage() {
  const [products, posts, orders, contacts] = await Promise.all([
    prisma.product.count(),
    prisma.post.count({ where: { type: "NEWS" } }),
    prisma.order.count(),
    prisma.contactInquiry.count(),
  ]);
  const recent = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 });
  const cards = [
    { label: "Sản phẩm", value: products, href: "/admin/products" },
    { label: "Tin tức", value: posts, href: "/admin/posts" },
    { label: "Đơn đặt trà", value: orders, href: "/admin/orders" },
    { label: "Liên hệ", value: contacts, href: "/admin/contacts" },
  ];
  return (
    <div>
      <AdminPageHeader title="Bảng điều khiển" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-ink/50">{c.label}</p>
            <p className="mt-2 text-3xl font-semibold text-[#3f7d3a]">{c.value}</p>
          </Link>
        ))}
      </div>
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
