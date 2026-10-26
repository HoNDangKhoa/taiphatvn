import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-[50vh] place-items-center bg-[#FBF4EC] px-6 text-center">
      <div>
        <p className="font-display text-5xl text-[#8B1E1F]">404</p>
        <p className="mt-2 text-[#6d564c]">Không tìm thấy trang.</p>
        <Link href="/" className="mt-4 inline-flex rounded-full bg-[#8B1E1F] px-5 py-2 text-sm font-semibold text-white">Về trang chủ</Link>
      </div>
    </div>
  );
}
