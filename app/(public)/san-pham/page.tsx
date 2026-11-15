import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { ProductsCatalog } from "@/components/site/ProductsCatalog";
import { getCategories, getPageSeo, getProducts } from "@/lib/queries";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("products");
  return { title: seo.title || "Sản phẩm", description: seo.description || undefined, keywords: seo.keywords || undefined };
}

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getProducts({ visibleOnly: true }), getCategories()]);
  return (
    <div className="bg-[#FBF4EC] pb-16">
      <PageHero title="Sản phẩm" crumb="Sản phẩm" />
      <div className="mx-auto max-w-[1100px] px-5">
        <ProductsCatalog
          products={products.map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            label: p.label,
            price: p.price,
            image: p.image,
            categoryName: p.categoryName,
            variants: p.variants.map((v) => ({ name: v.name, price: v.price })),
          }))}
          categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
        />
      </div>
    </div>
  );
}
