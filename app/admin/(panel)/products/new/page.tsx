import { AdminPageHeader } from "@/components/admin/AdminChrome";
import { ProductForm } from "@/components/admin/ProductForm";
import { getCategories } from "@/lib/queries";

export default async function NewProductPage() {
  const categories = await getCategories();
  return (
    <div>
      <AdminPageHeader title="Thêm sản phẩm" />
      <ProductForm
        categories={categories}
        initial={{ name: "", slug: "", label: "Premium Tea", summary: "", description: "", specs: "", price: 0, image: "", gallery: [], variants: [], categoryId: categories[0]?.id || "", featured: true, visible: true, sortOrder: 0 }}
      />
    </div>
  );
}
