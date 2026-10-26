import { notFound } from "next/navigation";
import {
  CtaEditor,
  ExclusiveEditor,
  FaqEditor,
  FlavorEditor,
  FooterEditor,
  GalleryEditor,
  HeaderEditor,
  HeroEditor,
  IdentityEditor,
  MarqueeEditor,
  ProductsSectionEditor,
  ReviewsEditor,
  StoryEditor,
} from "@/components/admin/HomeForms";
import { getBanner } from "@/lib/queries";

export default async function HomeSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const b = await getBanner();
  switch (section) {
    case "header": return <HeaderEditor initial={b.header} />;
    case "hero": return <HeroEditor initial={b.hero} />;
    case "story": return <StoryEditor initial={b.story} />;
    case "products": return <ProductsSectionEditor initial={b.products} />;
    case "gallery": return <GalleryEditor initial={b.gallery} />;
    case "flavor": return <FlavorEditor initial={b.flavor} />;
    case "marquee": return <MarqueeEditor initial={b.marquee} />;
    case "identity": return <IdentityEditor initial={b.identity} />;
    case "exclusive": return <ExclusiveEditor initial={b.exclusive} />;
    case "reviews": return <ReviewsEditor initial={b.reviews} />;
    case "faq": return <FaqEditor initial={b.faq} />;
    case "cta": return <CtaEditor initial={b.cta} />;
    case "footer": return <FooterEditor initial={b.footer} />;
    default: notFound();
  }
}
