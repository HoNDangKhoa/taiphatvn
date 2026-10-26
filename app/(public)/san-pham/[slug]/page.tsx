import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyBox } from "@/components/site/BuyBox";
import { PageHero } from "@/components/site/PageHero";
import { getProduct, getProducts } from "@/lib/queries";
import { formatPrice } from "@/lib/utils";

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product || !product.visible) notFound();
  const related = (await getProducts({ visibleOnly: true })).filter((p) => p.id !== product.id).slice(0, 3);
  return (
    <div className="bg-[#FBF4EC] pb-16">
      <PageHero title={product.name} crumb="Sản phẩm" />
      <div className="mx-auto max-w-[1100px] px-5">
        <BuyBox product={product} />
        <article className="rich mt-10 max-w-3xl text-[#4d3b34]" dangerouslySetInnerHTML={{ __html: product.description }} />
        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="font-display text-3xl text-[#8B1E1F]">Sản phẩm liên quan</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {related.map((p) => (
                <Link key={p.id} href={`/san-pham/${p.slug}`} className="text-center">
                  <img src={p.image} alt={p.name} className="mx-auto h-56 object-contain" />
                  <p className="mt-2 font-semibold">{p.name}</p>
                  <p className="text-sm text-[#8B1E1F]">{formatPrice(p.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
