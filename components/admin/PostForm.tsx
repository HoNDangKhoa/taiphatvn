"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { AdminCard, FormActionBar } from "@/components/admin/AdminChrome";
import { ImageField } from "@/components/admin/ImageField";
import { Input, Label, Select, Textarea } from "@/components/ui/input";

const RichEditor = dynamic(() => import("@/components/admin/RichEditor").then((m) => m.RichEditor), {
  ssr: false,
  loading: () => <div className="h-40 animate-pulse rounded-xl bg-black/5" />,
});
import { savePost } from "@/lib/actions";
import { useState } from "react";

export function PostForm({
  initial,
  type = "NEWS",
}: {
  type?: string;
  initial: {
    id?: string;
    title: string;
    slug: string;
    summary: string;
    contentHtml: string;
    thumbnail: string;
    status: string;
    metaTitle: string;
    metaDescription: string;
    seoKeywords: string;
  };
}) {
  const router = useRouter();
  const [thumbnail, setThumbnail] = useState(initial.thumbnail);
  const exitHref = type === "ABOUT" ? "/admin/about" : "/admin/posts";
  return (
    <form action={savePost} className="space-y-4">
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="thumbnail" value={thumbnail} />
      <FormActionBar onReset={() => setThumbnail(initial.thumbnail)} onExit={() => router.push(exitHref)} />
      <AdminCard title={type === "ABOUT" ? "Bài giới thiệu" : "Bài viết"}>
        <div className="grid gap-4">
          <div><Label>Tiêu đề</Label><Input name="title" defaultValue={initial.title} required /></div>
          <div><Label>Slug</Label><Input name="slug" defaultValue={initial.slug} /></div>
          {type !== "ABOUT" && (
            <div>
              <Label>Trạng thái</Label>
              <Select name="status" defaultValue={initial.status}>
                <option value="PUBLISHED">published</option>
                <option value="DRAFT">draft</option>
              </Select>
            </div>
          )}
          {type === "ABOUT" && <input type="hidden" name="status" value="PUBLISHED" />}
          <RichEditor name="summary" label="Mô tả (vi):" defaultValue={initial.summary} height={260} />
          <RichEditor name="contentHtml" label="Nội dung (vi):" defaultValue={initial.contentHtml} />
          <ImageField label="Ảnh đại diện" value={thumbnail} onChange={setThumbnail} />
        </div>
      </AdminCard>
      <AdminCard title="SEO bài viết">
        <div className="grid gap-4">
          <div><Label>Meta title</Label><Input name="metaTitle" defaultValue={initial.metaTitle} /></div>
          <div><Label>Meta description</Label><Textarea name="metaDescription" defaultValue={initial.metaDescription} /></div>
          <div><Label>Từ khóa</Label><Input name="seoKeywords" defaultValue={initial.seoKeywords} /></div>
        </div>
      </AdminCard>
    </form>
  );
}
