import { AdminCard, AdminPageHeader } from "@/components/admin/AdminChrome";
import { updateInquiry } from "@/lib/actions";
import { prisma } from "@/lib/prisma";

export default async function ContactsPage() {
  const rows = await prisma.contactInquiry.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <AdminPageHeader title="Đăng ký / Liên hệ" />
      <div className="space-y-3">
        {rows.length === 0 && <p className="text-sm text-ink/50">Chưa có liên hệ.</p>}
        {rows.map((row) => (
          <AdminCard key={row.id} title={`${row.fullName} · ${row.phone}`}>
            <p className="text-sm text-ink/70">{row.email}</p>
            <p className="mt-2 text-sm leading-6">{row.message}</p>
            <form action={async (fd: FormData) => { "use server"; await updateInquiry(row.id, String(fd.get("status")), String(fd.get("notes") || "")); }} className="mt-3 grid gap-2 md:grid-cols-[180px_1fr_auto]">
              <select name="status" defaultValue={row.status} className="h-10 rounded-lg border border-black/10 px-2 text-sm">
                <option value="NEW">Mới</option>
                <option value="CONTACTED">Đã gọi điện</option>
                <option value="PROCESSING">Đang xử lý</option>
                <option value="COMPLETED">Hoàn tất</option>
              </select>
              <input name="notes" defaultValue={row.notes || ""} placeholder="Ghi chú nội bộ" className="h-10 rounded-lg border border-black/10 px-3 text-sm" />
              <button className="rounded-xl bg-[#3f7d3a] px-4 text-sm font-semibold text-white">Lưu</button>
            </form>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
