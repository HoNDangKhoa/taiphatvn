import { CartView } from "@/components/site/CartView";
import { PageHero } from "@/components/site/PageHero";

export default function CartPage() {
  return (
    <div className="bg-[#FBF4EC] pb-16">
      <PageHero title="Đặt trà" crumb="Giỏ hàng" />
      <div className="mx-auto max-w-[1100px] px-5">
        <CartView />
      </div>
    </div>
  );
}
