import { AdminPageHeader } from "@/components/admin/AdminChrome";
import { ProductTable } from "@/components/admin/Lists";
import { getProducts } from "@/lib/queries";

export default async function ProductsAdminPage() {
  const products = await getProducts();
  return (
    <div>
      <AdminPageHeader title="Sản phẩm" />
      <ProductTable rows={products} />
    </div>
  );
}
