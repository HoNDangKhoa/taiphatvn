import { AdminPageHeader } from "@/components/admin/AdminChrome";
import { PostForm } from "@/components/admin/PostForm";

const empty = { title: "", slug: "", summary: "", contentHtml: "", thumbnail: "", status: "PUBLISHED", metaTitle: "", metaDescription: "", seoKeywords: "" };

export default function NewPostPage() {
  return (
    <div>
      <AdminPageHeader title="Thêm tin tức" />
      <PostForm initial={empty} />
    </div>
  );
}
