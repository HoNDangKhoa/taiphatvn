import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { getCategories, getPageSeo, getProducts } from "@/lib/queries";
import { formatPrice } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("products");
  return { title: seo.title || "Sản phẩm", description: seo.description || undefined, keywords: seo.keywords || undefined };
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ dm?: string }> }) {
  const { dm } = await searchParams;
  const [products, categories] = await Promise.all([getProducts({ visibleOnly: true }), getCategories()]);
  const list = dm ? products.filter((p) => p.categoryName && categories.find((c) => c.slug === dm)?.name === p.categoryName) : products;
  return (
    <div className="bg-[#FBF4EC] pb-16">
      <PageHero title="Sản phẩm" crumb="Sản phẩm" />
      <div className="mx-auto max-w-[1100px] px-5">
        <div className="mb-8 flex flex-wrap gap-2">
          <Link href="/san-pham" className={`rounded-full px-4 py-2 text-sm font-semibold ${!dm ? "bg-[#8B1E1F] text-white" : "bg-white"}`}>Tất cả</Link>
          {categories.map((c) => (
            <Link key={c.id} href={`/san-pham?dm=${c.slug}`} className={`rounded-full px-4 py-2 text-sm font-semibold ${dm === c.slug ? "bg-[#8B1E1F] text-white" : "bg-white"}`}>{c.name}</Link>
          ))}
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <Link key={p.id} href={`/san-pham/${p.slug}`} className="group text-center">
              <p className="text-xs font-semibold tracking-[0.16em] uppercase">{p.label}</p>
              <img src={p.image} alt={p.name} className="mx-auto mt-3 h-72 object-contain transition group-hover:-translate-y-1" />
              <h2 className="mt-2 font-semibold text-[#8B1E1F]">{p.name}</h2>
              <p className="text-sm font-semibold text-[#8B1E1F]">{formatPrice(p.price)}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
