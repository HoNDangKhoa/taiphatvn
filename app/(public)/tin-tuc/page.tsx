import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { getPosts } from "@/lib/queries";

export default async function NewsPage() {
  const posts = await getPosts("NEWS");
  return (
    <div className="bg-[#FBF4EC] pb-16">
      <PageHero title="Tin tức" crumb="Tin tức" />
      <div className="mx-auto grid max-w-[1100px] gap-6 px-5 md:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} href={`/tin-tuc/${post.slug}`} className="overflow-hidden rounded-[24px] bg-white shadow-sm">
            {post.thumbnail && <img src={post.thumbnail} alt="" className="mx-auto h-56 w-full bg-[#F7F1EA] object-contain p-2" />}
            <div className="p-4">
              <h2 className="font-display text-xl text-[#8B1E1F]">{post.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#6d564c]">{post.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
