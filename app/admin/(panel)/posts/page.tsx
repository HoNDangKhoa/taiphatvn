import { AdminPageHeader } from "@/components/admin/AdminChrome";
import { PostTable } from "@/components/admin/Lists";
import { prisma } from "@/lib/prisma";

export default async function PostsPage() {
  const rows = await prisma.post.findMany({ where: { type: "NEWS" }, orderBy: { createdAt: "desc" } });
  return (
    <div>
      <AdminPageHeader title="Tin tức" />
      <PostTable rows={rows} />
    </div>
  );
}
