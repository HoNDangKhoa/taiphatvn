import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { emptyPageSeo, parseBanner, SEO_PAGES, type BannerData, type PageSeo } from "@/lib/home";
import { parseJson } from "@/lib/utils";

export type Variant = { id: string; name: string; price: number; image?: string };
export type ProductView = {
  id: string;
  name: string;
  slug: string;
  label: string;
  summary: string;
  description: string;
  specs: string;
  price: number;
  image: string;
  gallery: string[];
  variants: Variant[];
  categoryName: string;
  featured: boolean;
  visible: boolean;
  sortOrder: number;
  categoryId: string;
};

function mapProduct(row: {
  id: string;
  name: string;
  slug: string;
  label: string;
  summary: string | null;
  description: string | null;
  specs: string | null;
  price: number;
  image: string | null;
  gallery: string | null;
  variants: string | null;
  featured: boolean;
  visible: boolean;
  sortOrder: number;
  categoryId: string | null;
  category?: { name: string } | null;
}): ProductView {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    label: row.label,
    summary: row.summary || "",
    description: row.description || "",
    specs: row.specs || "",
    price: row.price,
    image: row.image || "/media/tra-lai.jpg",
    gallery: parseJson<string[]>(row.gallery, []),
    variants: parseJson<Variant[]>(row.variants, []),
    categoryName: row.category?.name || "",
    featured: row.featured,
    visible: row.visible,
    sortOrder: row.sortOrder,
    categoryId: row.categoryId || "",
  };
}

const loadSettings = unstable_cache(
  () => prisma.siteSetting.findUnique({ where: { id: "site_config" } }),
  ["site-settings"],
  { tags: ["site"], revalidate: 120 },
);

const loadProducts = unstable_cache(
  async () => {
    const rows = await prisma.product.findMany({
      include: { category: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return rows.map(mapProduct);
  },
  ["catalog-products"],
  { tags: ["catalog"], revalidate: 120 },
);

export async function getSettings() {
  return loadSettings();
}

export async function getBanner(): Promise<BannerData> {
  const row = await getSettings();
  return parseBanner(row?.bannerData);
}

export async function getPageSeo(key: string): Promise<PageSeo> {
  const banner = await getBanner();
  const path = SEO_PAGES.find((page) => page.key === key)?.path || "";
  return { ...emptyPageSeo(path), ...banner.pageSeo?.[key] };
}

export async function getProducts(opts?: { visibleOnly?: boolean; featured?: boolean }) {
  const rows = await loadProducts();
  return rows.filter((row) => {
    if (opts?.visibleOnly && !row.visible) return false;
    if (opts?.featured && !row.featured) return false;
    return true;
  });
}

export async function getProduct(slug: string) {
  const row = await prisma.product.findUnique({ where: { slug }, include: { category: true } });
  return row ? mapProduct(row) : null;
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getPosts(type = "NEWS") {
  return prisma.post.findMany({
    where: { type, status: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
}

export async function getPost(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}

export async function getAbout() {
  return prisma.post.findFirst({ where: { type: "ABOUT" }, orderBy: { updatedAt: "desc" } });
}
