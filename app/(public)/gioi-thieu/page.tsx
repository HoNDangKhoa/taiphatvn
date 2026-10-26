import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { getAbout, getPageSeo } from "@/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("about");
  return { title: seo.title || "Giới thiệu", description: seo.description || undefined, keywords: seo.keywords || undefined };
}

export default async function AboutPage() {
  const post = await getAbout();
  return (
    <div className="bg-[#FBF4EC] pb-16">
      <PageHero title={post?.title || "Giới thiệu"} crumb="Giới thiệu" />
      <article className="mx-auto max-w-[900px] px-5">
        {post?.thumbnail && <img src={post.thumbnail} alt="" className="mb-6 max-h-[520px] w-full rounded-[28px] bg-[#F7F1EA] object-contain p-3" />}
        <div className="rich text-[#4d3b34]" dangerouslySetInnerHTML={{ __html: post?.contentHtml || "<p>Nội dung đang được cập nhật.</p>" }} />
      </article>
    </div>
  );
}
