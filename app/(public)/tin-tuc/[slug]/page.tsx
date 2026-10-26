import { notFound } from "next/navigation";
import { after } from "next/server";
import { PageHero } from "@/components/site/PageHero";
import { prisma } from "@/lib/prisma";
import { getPost } from "@/lib/queries";

export default async function NewsDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post || post.type !== "NEWS" || post.status !== "PUBLISHED") notFound();
  after(() => prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } }));
  return (
    <div className="bg-[#FBF4EC] pb-16">
      <PageHero title={post.title} crumb="Tin tức" />
      <article className="mx-auto max-w-[860px] px-5">
        {post.thumbnail && <img src={post.thumbnail} alt="" className="mb-6 max-h-[520px] w-full rounded-[24px] bg-[#F7F1EA] object-contain p-3" />}
        <div className="rich text-[#4d3b34]" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </article>
    </div>
  );
}
