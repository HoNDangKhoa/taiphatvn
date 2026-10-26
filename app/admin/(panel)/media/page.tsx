import { readdir } from "fs/promises";
import path from "path";
import { list } from "@vercel/blob";
import { AdminCard, AdminPageHeader } from "@/components/admin/AdminChrome";

export default async function MediaPage() {
  const dir = path.join(process.cwd(), "public", "media");
  const files = (await readdir(dir)).filter((name) => /\.(png|jpe?g|webp|svg|gif)$/i.test(name)).sort();
  let uploads: { url: string; pathname: string }[] = [];
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blobs = await list({ prefix: "uploads/", token: process.env.BLOB_READ_WRITE_TOKEN });
      uploads = blobs.blobs.map((blob) => ({ url: blob.url, pathname: blob.pathname }));
    } catch {
      uploads = [];
    }
  }
  return (
    <div>
      <AdminPageHeader title="Thư viện media" />
      <AdminCard title="Ảnh có sẵn trên website">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {files.map((name) => (
            <figure key={name} className="rounded-xl bg-[#f8f8f8] p-2">
              <img src={`/media/${name}`} alt="" className="h-28 w-full object-contain" />
              <figcaption className="mt-1 truncate text-xs text-ink/50">/media/{name}</figcaption>
            </figure>
          ))}
        </div>
      </AdminCard>
      <div className="mt-4">
        <AdminCard title="Ảnh đã tải lên">
          {uploads.length === 0 ? <p className="text-sm text-ink/50">Chưa có ảnh tải lên. Dùng nút Tải ảnh trong form sản phẩm, bài viết hoặc trang chủ.</p> : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {uploads.map((file) => (
                <figure key={file.url} className="rounded-xl bg-[#f8f8f8] p-2">
                  <img src={file.url} alt="" className="h-28 w-full object-contain" />
                  <figcaption className="mt-1 truncate text-xs text-ink/50">{file.pathname}</figcaption>
                </figure>
              ))}
            </div>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
