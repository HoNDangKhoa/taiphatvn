import { AdminPageHeader } from "@/components/admin/AdminChrome";
import { PostForm } from "@/components/admin/PostForm";
import { getAbout } from "@/lib/queries";

export default async function AboutAdminPage() {
  const post = await getAbout();
  return (
    <div>
      <AdminPageHeader title="Giới thiệu" />
      <PostForm
        type="ABOUT"
        initial={{
          id: post?.id,
          title: post?.title || "Giới thiệu Kim Khánh",
          slug: post?.slug || "gioi-thieu",
          summary: post?.summary || "",
          contentHtml: post?.contentHtml || "",
          thumbnail: post?.thumbnail || "",
          status: "PUBLISHED",
          metaTitle: post?.metaTitle || "",
          metaDescription: post?.metaDescription || "",
          seoKeywords: post?.seoKeywords || "",
        }}
      />
    </div>
  );
}
