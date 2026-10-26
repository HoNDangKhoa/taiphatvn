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
      { label: "Giới thiệu", href: "/admin/about" },
    ],
  },
  {
    label: "Quản lý trang chủ",
    icon: "home",
    children: [
      { label: "Thanh menu (Header)", href: "/admin/home/header" },
      { label: "Hero / Banner", href: "/admin/home/hero" },
      { label: "Câu chuyện Kim Khánh", href: "/admin/home/story" },
      { label: "Sản phẩm nổi bật", href: "/admin/home/products" },
      { label: "Gallery tinh hoa", href: "/admin/home/gallery" },
      { label: "Hương vị đậm đà", href: "/admin/home/flavor" },
      { label: "Thanh chữ chạy", href: "/admin/home/marquee" },
      { label: "Bản sắc và phong vị", href: "/admin/home/identity" },
      { label: "Độc quyền", href: "/admin/home/exclusive" },
      { label: "Đánh giá khách hàng", href: "/admin/home/reviews" },
      { label: "FAQ", href: "/admin/home/faq" },
      { label: "Banner đồi trà", href: "/admin/home/cta" },
      { label: "Footer", href: "/admin/home/footer" },
    ],
  },
  { label: "Đơn đặt trà", href: "/admin/orders", icon: "orders" },
  { label: "Đăng ký / Liên hệ", href: "/admin/contacts", icon: "contacts" },
  {
    label: "Quản lý hình ảnh",
    icon: "media",
    children: [
      { label: "Logo", href: "/admin/branding/logo" },
      { label: "Favicon", href: "/admin/branding/favicon" },
    ],
  },
  {
    label: "Quản lý SEO page",
    icon: "seo",
    children: [{ label: "Trang chủ", href: "/admin/settings" }],
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
