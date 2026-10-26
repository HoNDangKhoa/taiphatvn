import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminChrome";
import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";
import { getCategories } from "@/lib/queries";
import { parseJson } from "@/lib/utils";
import type { Variant } from "@/lib/queries";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [row, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    getCategories(),
  ]);
  if (!row) notFound();
  return (
    <div>
      <AdminPageHeader title="Sửa sản phẩm" />
      <ProductForm
        categories={categories}
        initial={{
          id: row.id,
          name: row.name,
          slug: row.slug,
          label: row.label,
          summary: row.summary || "",
          description: row.description || "",
          specs: row.specs || "",
          price: row.price,
          image: row.image || "",
          gallery: parseJson<string[]>(row.gallery, []),
          variants: parseJson<Variant[]>(row.variants, []),
          categoryId: row.categoryId || "",
          featured: row.featured,
          visible: row.visible,
          sortOrder: row.sortOrder,
        }}
      />
    </div>
  );
}
