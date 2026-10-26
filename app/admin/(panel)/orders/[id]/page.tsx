import { notFound } from "next/navigation";
import { AdminCard, AdminPageHeader } from "@/components/admin/AdminChrome";
import { updateOrderStatus } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { formatPrice, parseJson } from "@/lib/utils";

export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) notFound();
  const items = parseJson<{ name: string; variantName?: string; qty: number; price: number }[]>(order.items, []);
  return (
    <div>
      <AdminPageHeader title={`Đơn ${order.code}`} />
      <div className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
        <AdminCard title="Sản phẩm">
          <ul className="space-y-2 text-sm">
            {items.map((item, i) => (
              <li key={i} className="flex justify-between gap-3">
                <span>{item.name} {item.variantName ? `· ${item.variantName}` : ""} × {item.qty}</span>
                <span className="font-semibold">{formatPrice(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-right font-semibold">Tổng {formatPrice(order.total)}</p>
        </AdminCard>
        <AdminCard title="Khách hàng">
          <p className="text-sm leading-7">{order.fullName}<br />{order.phone}<br />{order.email}<br />{order.address}</p>
          {order.note && <p className="mt-2 text-sm text-ink/60">Ghi chú: {order.note}</p>}
          <form action={async (fd: FormData) => { "use server"; await updateOrderStatus(order.id, String(fd.get("status"))); }} className="mt-4 flex gap-2">
            <select name="status" defaultValue={order.status} className="h-10 flex-1 rounded-lg border border-black/10 px-2 text-sm">
              <option value="NEW">Mới</option>
              <option value="PROCESSING">Đang xử lý</option>
              <option value="COMPLETED">Hoàn tất</option>
              <option value="CANCELLED">Huỷ</option>
            </select>
            <button className="rounded-xl bg-[#3f7d3a] px-4 text-sm font-semibold text-white">Lưu</button>
          </form>
        </AdminCard>
      </div>
    </div>
  );
}
