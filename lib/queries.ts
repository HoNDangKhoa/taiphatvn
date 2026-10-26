import { prisma } from "@/lib/prisma";
import { parseBanner, type BannerData } from "@/lib/home";
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

export async function getSettings() {
  return prisma.siteSetting.findUnique({ where: { id: "site_config" } });
}

export async function getBanner(): Promise<BannerData> {
  const row = await getSettings();
  return parseBanner(row?.bannerData);
}

export async function getProducts(opts?: { visibleOnly?: boolean; featured?: boolean }) {
  const rows = await prisma.product.findMany({
    where: {
      ...(opts?.visibleOnly ? { visible: true } : {}),
      ...(opts?.featured ? { featured: true } : {}),
    },
    include: { category: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return rows.map(mapProduct);
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
