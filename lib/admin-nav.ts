import {
  BarChart3,
  FileText,
  FolderOpen,
  ImageIcon,
  LayoutTemplate,
  Mail,
  Newspaper,
  Search,
  Settings,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import { SEO_PAGES } from "@/lib/home";

export type AdminNavItem = {
  label: string;
  href?: string;
  icon?: string;
  children?: { label: string; href: string }[];
};

export const adminNav: AdminNavItem[] = [
  { label: "Bảng điều khiển", href: "/admin", icon: "dashboard" },
  {
    label: "Quản lý bài viết",
    icon: "posts",
    children: [
      { label: "Sản phẩm", href: "/admin/products" },
      { label: "Danh mục trà", href: "/admin/categories" },
      { label: "Tin tức", href: "/admin/posts" },
    ],
  },
  {
    label: "Đơn hàng & liên hệ",
    icon: "orders",
    children: [
      { label: "Đơn đặt trà", href: "/admin/orders" },
      { label: "Đăng ký / Liên hệ", href: "/admin/contacts" },
    ],
  },
  {
    label: "Quản lý trang chủ",
    icon: "home",
    children: [
      { label: "Thanh menu (Header)", href: "/admin/home/header" },
      { label: "Hero / Banner", href: "/admin/home/hero" },
      { label: "Giới thiệu sản phẩm", href: "/admin/home/story" },
      { label: "Sản phẩm chủ lực", href: "/admin/home/products" },
      { label: "Gallery trà trái cây", href: "/admin/home/gallery" },
      { label: "Mô tả hồng trà / trà lài", href: "/admin/home/flavor" },
      { label: "Thanh chữ chạy (ẩn)", href: "/admin/home/marquee" },
      { label: "Bản sắc (ẩn)", href: "/admin/home/identity" },
      { label: "Combo", href: "/admin/home/exclusive" },
      { label: "Đánh giá khách hàng", href: "/admin/home/reviews" },
      { label: "FAQ (ẩn)", href: "/admin/home/faq" },
      { label: "Banner CTA", href: "/admin/home/cta" },
      { label: "Footer", href: "/admin/home/footer" },
    ],
  },
  {
    label: "Trang tĩnh",
    icon: "pages",
    children: [{ label: "Giới thiệu", href: "/admin/about" }],
  },
  {
    label: "Quản lý hình ảnh",
    icon: "media",
    children: [
      { label: "Logo", href: "/admin/branding/logo" },
      { label: "Favicon", href: "/admin/branding/favicon" },
      { label: "Mạng xã hội Footer", href: "/admin/branding/social" },
      { label: "Thư viện media", href: "/admin/media" },
    ],
  },
  {
    label: "Quản lý SEO page",
    icon: "seo",
    children: SEO_PAGES.map((page) => ({ label: page.label, href: `/admin/seo/${page.key}` })),
  },
  { label: "Thiết lập thông tin", href: "/admin/settings", icon: "settings" },
];

export const adminIconMap = {
  dashboard: BarChart3,
  posts: FileText,
  home: LayoutTemplate,
  pages: Newspaper,
  media: ImageIcon,
  seo: Search,
  settings: Settings,
  contacts: Mail,
  orders: ShoppingBag,
  account: UserRound,
  folder: FolderOpen,
} as const;
