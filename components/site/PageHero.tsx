import Link from "next/link";

export function PageHero({ title, crumb }: { title: string; crumb: string }) {
  return (
    <section className="bg-[#FBF4EC] px-5 pt-10 pb-8">
      <div className="mx-auto max-w-[1100px]">
        <p className="text-sm text-[#8B1E1F]/80">
          <Link href="/" className="hover:underline">Trang chủ</Link>
          <span className="px-1.5">/</span>
          {crumb}
        </p>
        <h1 className="font-display mt-2 text-4xl text-[#8B1E1F] md:text-5xl">{title}</h1>
      </div>
    </section>
  );
}
