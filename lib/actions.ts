"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";
import { clearSession, readSession, writeSession } from "@/lib/session";
import { parseBanner, type BannerData, type HomeSectionKey } from "@/lib/home";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const session = await readSession();
  if (!session) throw new Error("Bạn cần đăng nhập quản trị.");
  return session;
}

function refresh() {
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
}

export async function login(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    redirect("/admin/login?e=1");
  }
  await writeSession({ id: user.id, email: user.email, name: user.name });
  redirect("/admin");
}

export async function logout() {
  await clearSession();
  redirect("/admin/login");
}

export async function saveHomeSection<K extends HomeSectionKey>(key: K, value: BannerData[K]) {
  await requireAdmin();
  const row = await prisma.siteSetting.findUnique({ where: { id: "site_config" } });
  const banner = parseBanner(row?.bannerData);
  banner[key] = value;
  await prisma.siteSetting.upsert({
    where: { id: "site_config" },
    update: { bannerData: JSON.stringify(banner) },
    create: { id: "site_config", bannerData: JSON.stringify(banner) },
  });
  refresh();
}

export async function saveSettings(formData: FormData) {
  await requireAdmin();
  const str = (k: string) => String(formData.get(k) || "");
  const data = {
    companyName: str("companyName"),
    slogan: str("slogan"),
    hotline: str("hotline"),
    phone: str("phone"),
    zalo: str("zalo"),
    email: str("email"),
    address: str("address"),
    taxCode: str("taxCode"),
    website: str("website"),
    mapsEmbedUrl: str("mapsEmbedUrl"),
    facebook: str("facebook"),
    instagram: str("instagram"),
    tiktok: str("tiktok"),
    messenger: str("messenger"),
    copyright: str("copyright"),
    metaTitle: str("metaTitle"),
    metaDescription: str("metaDescription"),
    seoKeywords: str("seoKeywords"),
    primaryKeyword: str("primaryKeyword"),
    headJs: str("headJs"),
    bodyJs: str("bodyJs"),
    googleAnalytics: str("googleAnalytics"),
    mailerHost: str("mailerHost"),
    mailerPort: str("mailerPort"),
    mailerSecure: str("mailerSecure"),
    mailerEmail: str("mailerEmail"),
    mailerPassword: str("mailerPassword"),
    logoUrl: str("logoUrl") || "/media/logo.png",
    faviconUrl: str("faviconUrl") || "/media/logo.png",
  };
  await prisma.siteSetting.upsert({
    where: { id: "site_config" },
    update: data,
    create: { id: "site_config", ...data },
  });
  refresh();
  return { ok: true as const };
}

export async function saveBrand(field: "logoUrl" | "faviconUrl", url: string) {
  await requireAdmin();
  await prisma.siteSetting.upsert({
    where: { id: "site_config" },
    update: { [field]: url },
    create: { id: "site_config", [field]: url },
  });
  refresh();
}

export async function changePassword(formData: FormData) {
  const session = await requireAdmin();
  const current = String(formData.get("current") || "");
  const next = String(formData.get("next") || "");
  const confirm = String(formData.get("confirm") || "");
  if (next.length < 6) return { ok: false as const, error: "Mật khẩu mới cần ít nhất 6 ký tự." };
  if (next !== confirm) return { ok: false as const, error: "Mật khẩu xác nhận chưa khớp." };
  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user || !(await bcrypt.compare(current, user.passwordHash))) {
    return { ok: false as const, error: "Mật khẩu hiện tại chưa đúng." };
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(next, 10), name: String(formData.get("name") || user.name) },
  });
  await writeSession({ id: user.id, email: user.email, name: String(formData.get("name") || user.name) });
  return { ok: true as const };
}

function productData(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const slug = slugify(String(formData.get("slug") || name));
  const variants = String(formData.get("variants") || "[]");
  const gallery = String(formData.get("gallery") || "[]");
  return {
    name,
    slug,
    label: String(formData.get("label") || "Premium Tea"),
    summary: String(formData.get("summary") || ""),
    description: String(formData.get("description") || ""),
    specs: String(formData.get("specs") || ""),
    price: Number(formData.get("price") || 0),
    image: String(formData.get("image") || ""),
    gallery,
    variants,
    categoryId: String(formData.get("categoryId") || "") || null,
    featured: formData.get("featured") === "on",
    visible: formData.get("visible") === "on",
    sortOrder: Number(formData.get("sortOrder") || 0),
  };
}

export async function saveProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const data = productData(formData);
  if (!data.name || !data.slug) throw new Error("Nhập tên sản phẩm.");
  if (id) {
    await prisma.product.update({ where: { id }, data });
  } else {
    await prisma.product.create({ data });
  }
  refresh();
  redirect("/admin/products");
}

export async function deleteProducts(ids: string[]) {
  await requireAdmin();
  await prisma.product.deleteMany({ where: { id: { in: ids } } });
  refresh();
}

export async function saveCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  if (!name) return;
  const data = { name, slug: slugify(name), sortOrder: Number(formData.get("sortOrder") || 0) };
  if (id) await prisma.category.update({ where: { id }, data });
  else await prisma.category.create({ data });
  refresh();
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.category.delete({ where: { id } });
  refresh();
}

export async function savePost(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const type = String(formData.get("type") || "NEWS");
  const slug = slugify(String(formData.get("slug") || title));
  if (!title || !slug) throw new Error("Nhập tiêu đề.");
  const data = {
    title,
    slug,
    summary: String(formData.get("summary") || ""),
    contentHtml: String(formData.get("contentHtml") || ""),
    thumbnail: String(formData.get("thumbnail") || ""),
    type,
    status: String(formData.get("status") || "PUBLISHED"),
    metaTitle: String(formData.get("metaTitle") || ""),
    metaDescription: String(formData.get("metaDescription") || ""),
    seoKeywords: String(formData.get("seoKeywords") || ""),
    publishedAt: new Date(),
  };
  if (id) await prisma.post.update({ where: { id }, data });
  else await prisma.post.create({ data });
  refresh();
  redirect(type === "ABOUT" ? "/admin/about" : "/admin/posts");
}

export async function deletePosts(ids: string[]) {
  await requireAdmin();
  await prisma.post.deleteMany({ where: { id: { in: ids } } });
  refresh();
}

export async function updateOrderStatus(id: string, status: string) {
  await requireAdmin();
  await prisma.order.update({ where: { id }, data: { status } });
  refresh();
}

export async function updateInquiry(id: string, status: string, notes: string) {
  await requireAdmin();
  await prisma.contactInquiry.update({ where: { id }, data: { status, notes } });
  refresh();
}

async function notify(subject: string, text: string) {
  const settings = await prisma.siteSetting.findUnique({ where: { id: "site_config" } });
  if (!settings?.mailerHost || !settings.mailerEmail || !settings.mailerPassword) return;
  const transporter = nodemailer.createTransport({
    host: settings.mailerHost,
    port: Number(settings.mailerPort || 587),
    secure: settings.mailerSecure === "true",
    auth: { user: settings.mailerEmail, pass: settings.mailerPassword },
  });
  await transporter.sendMail({
    from: settings.mailerEmail,
    to: settings.email || settings.mailerEmail,
    subject,
    text,
  });
}

export async function placeOrder(payload: {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  note?: string;
  items: { name: string; variantName?: string; qty: number; price: number }[];
}) {
  if (!payload.fullName.trim() || !payload.phone.trim() || !payload.address.trim()) {
    return { ok: false as const, error: "Vui lòng nhập họ tên, số điện thoại và địa chỉ." };
  }
  if (!payload.items.length) return { ok: false as const, error: "Giỏ hàng đang trống." };
  const total = payload.items.reduce((s, i) => s + i.price * i.qty, 0);
  const code = `TP${Date.now().toString().slice(-8)}`;
  await prisma.order.create({
    data: {
      code,
      fullName: payload.fullName.trim(),
      phone: payload.phone.trim(),
      email: payload.email?.trim() || "",
      address: payload.address.trim(),
      note: payload.note?.trim() || "",
      total,
      items: JSON.stringify(payload.items),
    },
  });
  try {
    await notify(
      `Đơn đặt trà ${code}`,
      `${payload.fullName} - ${payload.phone}\n${payload.address}\n${payload.items
        .map((i) => `- ${i.name} ${i.variantName || ""} x${i.qty}`)
        .join("\n")}\nTổng: ${total}`,
    );
  } catch {
    /* email is optional until SMTP is configured */
  }
  return { ok: true as const, code };
}

export async function sendContact(formData: FormData) {
  const fullName = String(formData.get("fullName") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();
  if (!fullName || !phone || !message) {
    return { ok: false as const, error: "Vui lòng nhập họ tên, số điện thoại và nội dung." };
  }
  await prisma.contactInquiry.create({ data: { fullName, phone, email, message } });
  try {
    await notify(`Liên hệ từ ${fullName}`, `${phone} ${email}\n${message}`);
  } catch {
    /* ignore mail errors */
  }
  return { ok: true as const };
}
