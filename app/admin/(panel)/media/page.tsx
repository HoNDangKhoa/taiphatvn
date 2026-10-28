import { readdir } from "fs/promises";
import path from "path";
import { list } from "@vercel/blob";
import { AdminCard, AdminPageHeader } from "@/components/admin/AdminChrome";
import { MediaGrid } from "@/components/admin/MediaLibrary";

export default async function MediaPage() {
  const mediaDir = path.join(process.cwd(), "public", "media");
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const mediaFiles = (await readdir(mediaDir).catch(() => [] as string[]))
    .filter((name) => /\.(png|jpe?g|webp|svg|gif)$/i.test(name))
    .sort()
    .map((name) => ({ url: `/media/${name}`, label: `/media/${name}` }));

  let uploads: { url: string; label: string }[] = [];
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blobs = await list({ prefix: "uploads/", token: process.env.BLOB_READ_WRITE_TOKEN });
      uploads = blobs.blobs
        .map((blob) => ({ url: blob.url, label: blob.url }))
        .sort((a, b) => b.url.localeCompare(a.url));
    } catch {
      uploads = [];
    }
  } else {
    const local = (await readdir(uploadDir).catch(() => [] as string[]))
      .filter((name) => /\.(png|jpe?g|webp|svg|gif)$/i.test(name))
      .sort()
      .reverse();
    uploads = local.map((name) => ({ url: `/uploads/${name}`, label: `/uploads/${name}` }));
  }

  return (
    <div>
      <AdminPageHeader title="Thư viện media" />
      <p className="mb-4 text-sm text-ink/60">
        Bấm <strong>Copy đường dẫn</strong> rồi dán vào ô Gallery sản phẩm (mỗi dòng một đường dẫn). Ảnh tải lên trên Vercel dùng URL đầy đủ, không dùng riêng chữ <code>uploads/…</code>.
      </p>
      <AdminCard title="Ảnh có sẵn trên website">
        <MediaGrid items={mediaFiles} />
      </AdminCard>
      <div className="mt-4">
        <AdminCard title="Ảnh đã tải lên">
          {uploads.length === 0 ? (
            <p className="text-sm text-ink/50">Chưa có ảnh tải lên. Dùng nút Tải ảnh trong form sản phẩm, bài viết hoặc trang chủ.</p>
          ) : (
            <MediaGrid items={uploads} />
          )}
        </AdminCard>
      </div>
    </div>
  );
}
