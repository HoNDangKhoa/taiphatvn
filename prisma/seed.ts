import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { defaultBanner } from "../lib/home";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@taiphat.vn").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "admin123";
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: "Quản trị Kim Khánh",
      email,
      passwordHash: await bcrypt.hash(password, 10),
    },
  });

  await prisma.siteSetting.upsert({
    where: { id: "site_config" },
    update: {},
    create: {
      id: "site_config",
      companyName: "CÔNG TY TNHH THƯƠNG MẠI TÀI PHÁT VN",
      slogan: "Tinh hoa trà Việt — Hương vị nguyên bản Kim Khánh",
      hotline: "0988 538 616",
      phone: "0988 538 616",
      zalo: "0988538616",
      email: "taiphattea@gmail.com",
      address: "Tổ 9 ấp 5 xã Tà Lài, tỉnh Đồng Nai, Vietnam",
      taxCode: "082829937902",
      website: "https://www.taiphat.vn",
      mapsEmbedUrl:
        "https://maps.google.com/maps?q=T%C3%A0%20L%C3%A0i%20%C4%90%E1%BB%93ng%20Nai&z=12&output=embed",
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      tiktok: "https://tiktok.com",
      messenger: "https://m.me",
      copyright:
        "Copyright © 2026 CÔNG TY TNHH THƯƠNG MẠI TÀI PHÁT VN. Design by Vinasoftware (VNS).",
      metaTitle: "Kim Khánh | Tinh hoa trà Việt — Thương mại Tài Phát VN",
      metaDescription:
        "Trà Kim Khánh của Công ty TNHH Thương mại Tài Phát VN: tinh hoa trà Việt, hương vị nguyên bản, thủ công gia truyền từ đồi cao Tây Bắc.",
      seoKeywords: "trà kim khánh, tài phát, hồng trà, trà lài, trà việt",
      primaryKeyword: "trà kim khánh",
      logoUrl: "/media/logo.png",
      faviconUrl: "/media/logo.png",
      bannerData: JSON.stringify(defaultBanner()),
    },
  });

  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.post.deleteMany();

  const lai = await prisma.category.create({
    data: { name: "Trà lài", slug: "tra-lai", sortOrder: 1 },
  });
  const hong = await prisma.category.create({
    data: { name: "Hồng trà", slug: "hong-tra", sortOrder: 2 },
  });

  const story =
    "Được vun trồng tại rẻo cao Tây Bắc mây phủ ngút ngàn và sao chế thủ công bởi nghệ nhân lão thành 35 năm, Kim Khánh Trà gìn giữ trọn vẹn vị chát êm dịu, hậu ngọt thanh đượm đà và hương cốm nồng nàn.";

  await prisma.product.createMany({
    data: [
      {
        name: "Trà Lài Tài Phát",
        slug: "tra-lai-tai-phat",
        label: "Premium Tea",
        summary: "Trà lài đặc biệt, hương hoa nhẹ và hậu ngọt thanh.",
        description: `<p>${story}</p><p>Túi trà lài Kim Khánh phù hợp pha nóng buổi sáng hoặc ủ lạnh. Nước trà xanh vàng, hương lài thanh, không gắt.</p>`,
        specs: "Thành phần: 100% búp chè lài\nKhối lượng: 250g / 500g\nXuất xứ: Tây Bắc, Việt Nam",
        price: 124000,
        image: "/media/tra-lai.jpg",
        gallery: JSON.stringify(["/media/tra-lai.jpg", "/media/tra-lai-2.jpg", "/media/hop-lai.jpg", "/media/gallery-green.jpg"]),
        variants: JSON.stringify([
          { id: "v250", name: "250g", price: 72000, image: "/media/tra-lai.jpg" },
          { id: "v500", name: "500g", price: 124000, image: "/media/tra-lai-2.jpg" },
        ]),
        categoryId: lai.id,
        featured: true,
        visible: true,
        sortOrder: 1,
      },
      {
        name: "Hồng Trà Tài Phát",
        slug: "hong-tra-tai-phat",
        label: "Black Tea",
        summary: "Hồng trà đậm đà, nước đỏ hổ phách, chuẩn vị truyền thống.",
        description: `<p>100% lá trà đen chọn lọc, đúc kết tinh túy từ đồi cao. Hương thơm tự nhiên quyến rũ, nước trà đậm đà, chuẩn vị trà truyền thống.</p>`,
        specs: "Thành phần: 100% lá trà đen\nKhối lượng: 250g / 500g\nXuất xứ: Tây Bắc, Việt Nam",
        price: 124000,
        image: "/media/hong-tra.jpg",
        gallery: JSON.stringify(["/media/hong-tra.jpg", "/media/story-pack.jpg", "/media/tui-hong.jpg", "/media/gallery-black.jpg"]),
        variants: JSON.stringify([
          { id: "v250", name: "250g", price: 72000, image: "/media/story-pack.jpg" },
          { id: "v500", name: "500g", price: 124000, image: "/media/hong-tra.jpg" },
        ]),
        categoryId: hong.id,
        featured: true,
        visible: true,
        sortOrder: 2,
      },
      {
        name: "Trà Lài Đặc Biệt",
        slug: "tra-lai-dac-biet",
        label: "Premium Tea",
        summary: "Mẻ trà lài thủ công, giữ nguyên hương cốm nồng.",
        description: `<p>${story}</p>`,
        specs: "Thành phần: búp chè hữu cơ ướp lài\nKhối lượng: 500g",
        price: 124000,
        image: "/media/tra-lai-2.jpg",
        gallery: JSON.stringify(["/media/tra-lai-2.jpg", "/media/tui-lai.jpg", "/media/hop-lai-2.jpg"]),
        variants: JSON.stringify([
          { id: "v500", name: "500g", price: 124000, image: "/media/tra-lai-2.jpg" },
        ]),
        categoryId: lai.id,
        featured: true,
        visible: true,
        sortOrder: 3,
      },
      {
        name: "Black Tea Kim Khánh",
        slug: "black-tea-kim-khanh",
        label: "Black Tea",
        summary: "Túi hồng trà specialty, vị đậm và hậu ngọt.",
        description: `<p>Hồng trà Tài Phát dành cho người thích nước trà đậm, pha sữa hoặc uống nóng nguyên vị.</p>`,
        specs: "Thành phần: 100% hồng trà\nKhối lượng: 500g",
        price: 124000,
        image: "/media/tui-hong.jpg",
        gallery: JSON.stringify(["/media/tui-hong.jpg", "/media/hop-hong.jpg", "/media/oval-pack.jpg", "/media/gallery-black.jpg"]),
        variants: JSON.stringify([
          { id: "v500", name: "500g", price: 124000, image: "/media/tui-hong.jpg" },
        ]),
        categoryId: hong.id,
        featured: true,
        visible: true,
        sortOrder: 4,
      },
    ],
  });

  await prisma.post.create({
    data: {
      type: "ABOUT",
      status: "PUBLISHED",
      title: "Câu chuyện Kim Khánh",
      slug: "gioi-thieu",
      summary: "Về cội nguồn — tinh túy từ đồi cao.",
      thumbnail: "/media/story-pack.jpg",
      publishedAt: new Date(),
      contentHtml: `<p>Kim Khánh là thương hiệu trà của Công ty TNHH Thương mại Tài Phát VN. Mỗi túi trà bắt đầu từ những đồi chè mây phủ ở rẻo cao Tây Bắc, nơi búp chè được hái chọn và sao chế thủ công bởi nghệ nhân lão thành hơn 35 năm.</p><p>Chúng tôi giữ vị chát êm dịu, hậu ngọt thanh và hương cốm nồng nàn — hương vị nguyên bản của trà Việt, không hương liệu công nghiệp.</p><p>Hai dòng chủ lực là Trà Lài Tài Phát và Hồng Trà Tài Phát, đóng gói 250g và 500g, giao tới khách hàng trên toàn quốc.</p>`,
    },
  });

  await prisma.post.createMany({
    data: [
      {
        type: "NEWS",
        status: "PUBLISHED",
        title: "Vì sao hồng trà Kim Khánh giữ được vị truyền thống",
        slug: "vi-sao-hong-tra-kim-khanh",
        summary: "Lá trà đen chọn lọc, sao thủ công và nước trà đậm đà.",
        thumbnail: "/media/hong-tra.jpg",
        publishedAt: new Date(),
        contentHtml: `<p>${story}</p><p>Hồng trà được làm từ 100% lá trà đen chọn lọc. Nước pha ra đỏ hổ phách, hương thơm tự nhiên và hậu ngọt rõ — đúng chuẩn vị trà truyền thống.</p>`,
      },
      {
        type: "NEWS",
        status: "PUBLISHED",
        title: "Cách pha trà lài giữ hương cốm",
        slug: "cach-pha-tra-lai",
        summary: "Nước 85°C, ủ ngắn và tách sứ để hương lài không bị gắt.",
        thumbnail: "/media/gallery-green.jpg",
        publishedAt: new Date(),
        contentHtml: `<p>Cho 3–4g trà lài vào ấm đã tráng nóng. Rót nước khoảng 85°C, hãm 20–30 giây với nước đầu rồi pha chính 45–60 giây. Hương lài thanh sẽ đi cùng vị chát êm và hậu ngọt.</p>`,
      },
      {
        type: "NEWS",
        status: "PUBLISHED",
        title: "Đặt trà Kim Khánh giao toàn quốc",
        slug: "dat-tra-giao-toan-quoc",
        summary: "Chọn quy cách 250g hoặc 500g và gửi đơn trong vài phút.",
        thumbnail: "/media/hill-bg.jpg",
        publishedAt: new Date(),
        contentHtml: `<p>Vào trang sản phẩm, chọn túi trà và khối lượng. Thêm vào giỏ, điền họ tên, số điện thoại và địa chỉ. Đội ngũ Tài Phát xác nhận đơn qua điện thoại trước khi giao.</p>`,
      },
    ],
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
