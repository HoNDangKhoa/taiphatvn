import { login } from "@/lib/actions";
import { readSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const session = await readSession();
  if (session) redirect("/admin");
  const { e } = await searchParams;
  return (
    <div className="grid min-h-screen place-items-center bg-[#f3f4f6] px-4">
      <form action={login} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#3f7d3a] font-semibold text-white">KK</div>
          <div>
            <p className="font-semibold">Kim Khánh CMS</p>
            <p className="text-sm text-ink/50">Đăng nhập quản trị</p>
          </div>
        </div>
        <label className="block text-sm font-semibold">Email
          <input name="email" type="email" required defaultValue="admin@taiphat.vn" className="mt-1 h-11 w-full rounded-xl border border-black/10 px-3 font-normal" />
        </label>
        <label className="mt-3 block text-sm font-semibold">Mật khẩu
          <input name="password" type="password" required className="mt-1 h-11 w-full rounded-xl border border-black/10 px-3 font-normal" />
        </label>
        {e && <p className="mt-3 text-sm font-semibold text-red-600">Email hoặc mật khẩu chưa đúng.</p>}
        <button className="mt-5 w-full rounded-xl bg-[#3f7d3a] py-3 text-sm font-semibold text-white">Đăng nhập</button>
        <p className="mt-4 text-xs text-ink/45">Tài khoản mẫu: admin@taiphat.vn / admin123</p>
      </form>
    </div>
  );
}
