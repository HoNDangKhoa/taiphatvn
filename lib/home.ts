import { uid } from "./utils";

export type NavLink = { id: string; label: string; href: string };

export type HeaderContent = {
  links: NavLink[];
  hotlineLabel: string;
  ctaLabel: string;
  ctaHref: string;
};

export type HeroTag = { id: string; text: string; tone: "light" | "solid" | "outline" };
export type HeroBadge = { id: string; text: string };

export type HeroContent = {
  tags: HeroTag[];
  title: string;
  subtitle: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  image: string;
  badges: HeroBadge[];
};

export type StoryContent = {
  eyebrow: string;
  title: string;
  image: string;
  description: string;
  sealText: string;
};

export type ProductsSection = {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

export type GalleryImage = { id: string; src: string; alt: string };
export type GalleryContent = {
  title: string;
  subtitle: string;
  sealText: string;
  images: GalleryImage[];
};

export type FlavorContent = {
  leftTitle: string;
  leftText: string;
  leftNote: string;
  rightCard: string;
};

export type MarqueeContent = { text: string };

export type IdentityContent = {
  title: string;
  description: string;
  images: GalleryImage[];
};

export type ExclusiveContent = {
  title: string;
  highlight: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
};

export type ReviewItem = { id: string; name: string; content: string; image: string };
export type ReviewsContent = { title: string; description: string; items: ReviewItem[] };

export type FaqItem = { id: string; question: string; answer: string };
export type FaqContent = {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  items: FaqItem[];
};

export type CtaContent = {
  image: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  sealText: string;
};

export type FooterContent = {
  infoTitle: string;
  linksTitle: string;
  socialTitle: string;
  links: NavLink[];
};

export type PageSeo = {
  title: string;
  keywords: string;
  description: string;
  focusKeyword: string;
  ogImage: string;
  indexable: boolean;
  canonical: string;
  ogSiteName: string;
  ogType: string;
  ogUrl: string;
};

export const SEO_PAGES = [
  { key: "home", label: "Trang chủ", path: "/" },
  { key: "products", label: "Sản phẩm", path: "/san-pham" },
  { key: "news", label: "Tin tức", path: "/tin-tuc" },
  { key: "about", label: "Giới thiệu", path: "/gioi-thieu" },
  { key: "contact", label: "Liên hệ", path: "/lien-he" },
] as const;

export function emptyPageSeo(path = ""): PageSeo {
  return {
    title: "",
    keywords: "",
    description: "",
    focusKeyword: "",
    ogImage: "",
    indexable: true,
    canonical: path,
    ogSiteName: "Kim Khánh",
    ogType: "website",
    ogUrl: path,
  };
}

export type BannerData = {
  pageSeo: Record<string, PageSeo>;
  header: HeaderContent;
  hero: HeroContent;
  story: StoryContent;
  products: ProductsSection;
  gallery: GalleryContent;
  flavor: FlavorContent;
  marquee: MarqueeContent;
  identity: IdentityContent;
  exclusive: ExclusiveContent;
  reviews: ReviewsContent;
  faq: FaqContent;
  cta: CtaContent;
  footer: FooterContent;
};

export type HomeSectionKey = keyof BannerData;

const STORY =
  "Được vun trồng tại rẻo cao Tây Bắc mây phủ ngút ngàn và sao chế thủ công bởi nghệ nhân lão thành 35 năm, Kim Khánh Trà gìn giữ trọn vẹn vị chát êm dịu, hậu ngọt thanh đượm đà và hương cốm nồng nàn.";

const PURE =
  "100% NGUYÊN CHẤT & CHỌN LỌC: SẢN PHẨM ĐƯỢC LÀM TỪ 100% LÁ TRÀ ĐEN CHỌN LỌC, ĐÚC KẾT TINH TÚY TỪ ĐỒI CAO. HƯƠNG VỊ ĐẬM ĐÀ: TRÀ SỞ HỮU HƯƠNG THƠM TỰ NHIÊN QUYẾN RŨ, NƯỚC TRÀ ĐẬM ĐÀ, CHUẨN VỊ TRÀ TRUYỀN THỐNG.";

const FLAVOR =
  "HƯƠNG VỊ ĐẬM ĐÀ: TRÀ SỞ HỮU HƯƠNG THƠM TỰ NHIÊN QUYẾN RŨ, NƯỚC TRÀ ĐẬM ĐÀ, CHUẨN VỊ TRÀ TRUYỀN THỐNG.";

export function defaultBanner(): BannerData {
  return {
    pageSeo: Object.fromEntries(SEO_PAGES.map((page) => [page.key, emptyPageSeo(page.path)])),
    header: {
      links: [
        { id: "n1", label: "Giới thiệu", href: "/gioi-thieu" },
        { id: "n2", label: "Sản phẩm", href: "/san-pham" },
        { id: "n3", label: "Liên hệ", href: "/lien-he" },
        { id: "n4", label: "Tin tức", href: "/tin-tuc" },
      ],
      hotlineLabel: "0988 538 616",
      ctaLabel: "Đặt trà ngay",
      ctaHref: "/gio-hang",
    },
    hero: {
      tags: [
        { id: "t1", text: "Di sản trà Việt Nam", tone: "light" },
        { id: "t2", text: "100% thuần khiết", tone: "solid" },
        { id: "t3", text: "Thủ công gia truyền", tone: "outline" },
      ],
      title: "Tinh hoa trà Việt",
      subtitle: "Hương vị nguyên bản Kim Khánh",
      description: STORY,
      primaryLabel: "Đặt trà ngay",
      primaryHref: "/gio-hang",
      secondaryLabel: "0988 538 616",
      image: "/media/hero-card.jpg",
      badges: [
        { id: "b1", text: "Búp chè hữu cơ" },
        { id: "b2", text: "Specialty Tea" },
      ],
    },
    story: {
      eyebrow: "Về cội nguồn • Tinh túy từ đồi cao",
      title: "Câu chuyện Kim Khánh",
      image: "/media/story-pack.jpg",
      description: PURE,
      sealText: "TRÀ VIỆT • KIM KHÁNH • TINH HOA • ",
    },
    products: {
      title: "Sản phẩm Kim Khánh",
      description: STORY,
      ctaLabel: "Xem tất cả",
      ctaHref: "/san-pham",
    },
    gallery: {
      title: "Tinh hoa trà Việt",
      subtitle: "Hương vị nguyên bản Kim Khánh",
      sealText: "TINH HOA TRÀ VIỆT • KIM KHÁNH • ",
      images: [
        { id: "g1", src: "/media/gallery-green.jpg", alt: "Trà lài Tài Phát" },
        { id: "g2", src: "/media/gallery-black.jpg", alt: "Hồng trà Tài Phát" },
      ],
    },
    flavor: {
      leftTitle: FLAVOR,
      leftText: STORY,
      leftNote: "Kim Khánh Trà gìn giữ trọn vẹn vị chát êm dịu, hậu ngọt thanh đượm đà và hương cốm nồng nàn.",
      rightCard: FLAVOR,
    },
    marquee: { text: "TINH TUÝ TỪ ĐỒI CAO" },
    identity: {
      title: "Bản sắc và phong vị Kim Khánh",
      description: PURE,
      images: [
        { id: "i1", src: "/media/life-milktea.jpg", alt: "Trà sữa Kim Khánh" },
        { id: "i2", src: "/media/life-pour.jpg", alt: "Pha trà" },
        { id: "i3", src: "/media/life-cups.jpg", alt: "Ly trà trái cây" },
      ],
    },
    exclusive: {
      title: "Độc quyền tại Kim Khánh",
      highlight: FLAVOR,
      description: STORY,
      ctaLabel: "Đặt ngay",
      ctaHref: "/gio-hang",
      image: "/media/oval-pack.jpg",
    },
    reviews: {
      title: "Đánh giá khách hàng",
      description: "Kim Khánh Trà gìn giữ trọn vẹn vị chát êm dịu, hậu ngọt thanh đượm đà và hương cốm nồng nàn.",
      items: [
        {
          id: "r1",
          name: "Lisa Nguyen",
          content: STORY,
          image: "/media/life-pour.jpg",
        },
        {
          id: "r2",
          name: "Minh Anh",
          content:
            "Hồng trà đậm vị, nước trong và hậu ngọt rất rõ. Mình dùng mỗi sáng và vẫn thấy hương cốm rất riêng của Kim Khánh.",
          image: "/media/life-milktea.jpg",
        },
        {
          id: "r3",
          name: "Hoàng Long",
          content:
            "Đóng gói chỉn chu, trà thơm tự nhiên. Pha lạnh hay pha nóng đều giữ được vị truyền thống, không gắt.",
          image: "/media/life-cups.jpg",
        },
      ],
    },
    faq: {
      title: "FAQ",
      description: FLAVOR,
      ctaLabel: "Liên hệ với chúng tôi",
      ctaHref: "/lien-he",
      items: [
        {
          id: "f1",
          question: "Kim Khánh Trà được trồng và sao chế như thế nào?",
          answer: STORY,
        },
        {
          id: "f2",
          question: "Sản phẩm có phải 100% nguyên chất?",
          answer: PURE,
        },
        {
          id: "f3",
          question: "Quy cách đóng gói và khối lượng thế nào?",
          answer:
            "Trà được đóng túi 250g và 500g. Khi đặt hàng bạn chọn quy cách, giá và hình sản phẩm cập nhật theo từng lựa chọn.",
        },
        {
          id: "f4",
          question: "Bảo quản trà ra sao để giữ hương?",
          answer:
            "Để túi trà nơi khô ráo, thoáng, tránh nắng gắt và hộp có mùi mạnh. Sau khi mở, gấp kín miệng túi và dùng trong vài tuần để giữ hậu ngọt.",
        },
        {
          id: "f5",
          question: "Có giao hàng toàn quốc không?",
          answer:
            "Kim Khánh nhận đặt trà trên toàn quốc. Điền họ tên, số điện thoại và địa chỉ trong giỏ hàng, đơn sẽ được xác nhận qua điện thoại.",
        },
        {
          id: "f6",
          question: "Làm sao để đặt trà ngay?",
          answer:
            "Bấm Đặt trà ngay, chọn sản phẩm và quy cách, rồi gửi form. Bạn cũng có thể gọi hotline 0988 538 616.",
        },
      ],
    },
    cta: {
      image: "/media/hill-bg.jpg",
      title: "Tinh hoa trà Việt",
      subtitle: "Hương vị nguyên bản Kim Khánh",
      ctaLabel: "Đặt hàng ngay",
      ctaHref: "/gio-hang",
      sealText: "TINH HOA TRÀ VIỆT • KIM KHÁNH • ",
    },
    footer: {
      infoTitle: "Thông tin về Kim Khánh",
      linksTitle: "Liên kết",
      socialTitle: "Social Media",
      links: [
        { id: "fl1", label: "Giới thiệu", href: "/gioi-thieu" },
        { id: "fl2", label: "Sản phẩm", href: "/san-pham" },
        { id: "fl3", label: "Liên hệ", href: "/lien-he" },
        { id: "fl4", label: "Tin tức", href: "/tin-tuc" },
      ],
    },
  };
}

export function parseBanner(raw?: string | null): BannerData {
  const base = defaultBanner();
  if (!raw) return base;
  try {
    const data = JSON.parse(raw) as Partial<BannerData>;
    const pageSeo = { ...base.pageSeo };
    for (const page of SEO_PAGES) {
      pageSeo[page.key] = { ...emptyPageSeo(page.path), ...data.pageSeo?.[page.key] };
    }
    return {
      pageSeo,
      header: { ...base.header, ...data.header, links: data.header?.links?.length ? data.header.links : base.header.links },
      hero: { ...base.hero, ...data.hero, tags: data.hero?.tags?.length ? data.hero.tags : base.hero.tags, badges: data.hero?.badges?.length ? data.hero.badges : base.hero.badges },
      story: { ...base.story, ...data.story },
      products: { ...base.products, ...data.products },
      gallery: { ...base.gallery, ...data.gallery, images: data.gallery?.images?.length ? data.gallery.images : base.gallery.images },
      flavor: { ...base.flavor, ...data.flavor },
      marquee: { ...base.marquee, ...data.marquee },
      identity: { ...base.identity, ...data.identity, images: data.identity?.images?.length ? data.identity.images : base.identity.images },
      exclusive: { ...base.exclusive, ...data.exclusive },
      reviews: { ...base.reviews, ...data.reviews, items: data.reviews?.items?.length ? data.reviews.items : base.reviews.items },
      faq: { ...base.faq, ...data.faq, items: data.faq?.items?.length ? data.faq.items : base.faq.items },
      cta: { ...base.cta, ...data.cta },
      footer: { ...base.footer, ...data.footer, links: data.footer?.links?.length ? data.footer.links : base.footer.links },
    };
  } catch {
    return base;
  }
}

export function newLink(): NavLink {
  return { id: uid("nav"), label: "Liên kết mới", href: "/" };
}
export function newTag(): HeroTag {
  return { id: uid("tag"), text: "Nhãn mới", tone: "light" };
}
export function newBadge(): HeroBadge {
  return { id: uid("badge"), text: "Badge" };
}
export function newImage(): GalleryImage {
  return { id: uid("img"), src: "", alt: "" };
}
export function newReview(): ReviewItem {
  return { id: uid("rev"), name: "Khách hàng", content: "", image: "" };
}
export function newFaq(): FaqItem {
  return { id: uid("faq"), question: "Câu hỏi mới", answer: "" };
}
