import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminChrome";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

const label: Record<string, string> = { NEW: "Mới", PROCESSING: "Đang xử lý", COMPLETED: "Hoàn tất", CANCELLED: "Huỷ" };

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <AdminPageHeader title="Đơn đặt trà" />
      <div className="overflow-hidden rounded-2xl border border-black/8 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f8f8f8] text-xs text-ink/50 uppercase">
            <tr><th className="p-3">Mã</th><th className="p-3">Khách</th><th className="p-3">Tổng</th><th className="p-3">Trạng thái</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-black/5">
                <td className="p-3"><Link className="font-semibold text-[#3f7d3a]" href={`/admin/orders/${o.id}`}>{o.code}</Link></td>
                <td className="p-3">{o.fullName}<div className="text-xs text-ink/45">{o.phone}</div></td>
                <td className="p-3">{formatPrice(o.total)}</td>
                <td className="p-3">{label[o.status] || o.status}</td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td className="p-4 text-ink/50" colSpan={4}>Chưa có đơn.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
