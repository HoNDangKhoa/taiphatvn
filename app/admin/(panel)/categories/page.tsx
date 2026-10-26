import { AdminCard, AdminPageHeader } from "@/components/admin/AdminChrome";
import { deleteCategory, saveCategory } from "@/lib/actions";
import { getCategories } from "@/lib/queries";

export default async function CategoriesPage() {
  const categories = await getCategories();
  return (
    <div>
      <AdminPageHeader title="Danh mục trà" />
      <AdminCard title="Thêm danh mục">
        <form action={saveCategory} className="flex flex-wrap gap-2">
          <input name="name" placeholder="Tên danh mục" className="h-10 flex-1 rounded-lg border border-black/10 px-3 text-sm" required />
          <input name="sortOrder" type="number" defaultValue={categories.length + 1} className="h-10 w-24 rounded-lg border border-black/10 px-3 text-sm" />
          <button className="rounded-xl bg-[#3f7d3a] px-4 text-sm font-semibold text-white">Lưu</button>
        </form>
      </AdminCard>
      <div className="mt-4 space-y-3">
        {categories.map((c) => (
          <AdminCard key={c.id} title={c.name}>
            <form action={saveCategory} className="flex flex-wrap gap-2">
              <input type="hidden" name="id" value={c.id} />
              <input name="name" defaultValue={c.name} className="h-10 flex-1 rounded-lg border border-black/10 px-3 text-sm" />
              <input name="sortOrder" type="number" defaultValue={c.sortOrder} className="h-10 w-24 rounded-lg border border-black/10 px-3 text-sm" />
              <button className="rounded-xl bg-[#3f7d3a] px-4 text-sm font-semibold text-white">Cập nhật</button>
            </form>
            <form action={deleteCategory} className="mt-2">
              <input type="hidden" name="id" value={c.id} />
              <button className="text-sm font-semibold text-red-600">Xóa</button>
            </form>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
