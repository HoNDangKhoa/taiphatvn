import { HomeView } from "@/components/site/HomeView";
import { getBanner, getProducts } from "@/lib/queries";

export default async function HomePage() {
  const [banner, products] = await Promise.all([getBanner(), getProducts({ visibleOnly: true, featured: true })]);
  return <HomeView banner={banner} products={products} />;
}
