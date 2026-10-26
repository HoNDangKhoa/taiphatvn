import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminChrome";
import { PostForm } from "@/components/admin/PostForm";
import { prisma } from "@/lib/prisma";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();
  return (
    <div>
      <AdminPageHeader title="Sửa bài viết" />
      <PostForm
        type={post.type}
        initial={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          summary: post.summary || "",
          contentHtml: post.contentHtml,
          thumbnail: post.thumbnail || "",
          status: post.status,
          metaTitle: post.metaTitle || "",
          metaDescription: post.metaDescription || "",
          seoKeywords: post.seoKeywords || "",
        }}
      />
    </div>
  );
}
