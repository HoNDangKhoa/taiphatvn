"use client";

import { AdminCard } from "@/components/admin/AdminChrome";
import { ImageField } from "@/components/admin/HomeForms";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
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
  const [thumbnail, setThumbnail] = useState(initial.thumbnail);
  return (
    <form action={savePost} className="space-y-4">
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="thumbnail" value={thumbnail} />
      <button className="rounded-xl bg-[#3f7d3a] px-4 py-2.5 text-sm font-semibold text-white">Lưu</button>
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
          <div><Label>Tóm tắt</Label><Textarea name="summary" defaultValue={initial.summary} /></div>
          <div><Label>Nội dung HTML</Label><Textarea name="contentHtml" rows={12} defaultValue={initial.contentHtml} /></div>
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
