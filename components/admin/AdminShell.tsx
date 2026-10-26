"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, ExternalLink, Menu, X } from "lucide-react";
import { adminIconMap, adminNav } from "@/lib/admin-nav";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href?: string) {
  if (!href) return false;
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({
  children,
  userName,
  userInitial,
  signOutAction,
}: {
  children: React.ReactNode;
  userName: string;
  userInitial: string;
  signOutAction: () => Promise<void>;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    adminNav.forEach((item) => {
      if (item.children?.some((c) => isActive(pathname, c.href))) init[item.label] = true;
    });
    return init;
  });
  const crumbs = useMemo(() => {
    const list: string[] = [];
    for (const item of adminNav) {
      const child = item.children?.find((c) => isActive(pathname, c.href));
      if (child) {
        list.push(item.label, child.label);
        if (pathname.endsWith("/new")) list.push("Thêm mới");
        else if (pathname !== child.href && !pathname.endsWith("/new")) list.push("Chỉnh sửa");
      } else if (item.href && isActive(pathname, item.href) && item.href !== "/admin") list.push(item.label);
    }
    if (pathname.includes("/account")) list.push("Tài khoản");
    return list;
  }, [pathname]);

  const Sidebar = (
    <aside className="flex h-full w-[280px] flex-col bg-white text-ink">
      <div className="border-b border-black/5 px-4 py-4">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3f7d3a] text-sm font-semibold text-white">KK</div>
          <div>
            <p className="text-sm font-semibold leading-tight">Kim Khánh</p>
            <p className="text-xs font-semibold text-ink/50">Tài Phát CMS</p>
          </div>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {adminNav.map((item) => {
          const Icon = adminIconMap[(item.icon as keyof typeof adminIconMap) || "folder"];
          if (!item.children) {
            const active = isActive(pathname, item.href);
            return (
              <Link key={item.label} href={item.href || "/admin"} onClick={() => setMobileOpen(false)} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold", active ? "bg-gradient-to-r from-[#3f7d3a] to-[#6a9e4f] text-white" : "text-ink/70 hover:bg-black/5")}>
                <Icon size={18} /> {item.label}
              </Link>
            );
          }
          const open = openGroups[item.label];
          return (
            <div key={item.label}>
              <button type="button" onClick={() => setOpenGroups((s) => ({ ...s, [item.label]: !s[item.label] }))} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink/70 hover:bg-black/5">
                <Icon size={18} />
                <span className="flex-1 text-left">{item.label}</span>
                {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              {open && (
                <div className="mt-1 ml-4 space-y-1 border-l border-black/10 pl-3">
                  {item.children.map((child) => (
                    <Link key={child.href} href={child.href} onClick={() => setMobileOpen(false)} className={cn("block rounded-lg px-3 py-2 text-sm font-semibold", isActive(pathname, child.href) ? "bg-gradient-to-r from-[#3f7d3a] to-[#6a9e4f] text-white" : "text-ink/65 hover:bg-black/5")}>
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className="border-t border-black/5 p-3">
        <Link href="/" target="_blank" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink/60 hover:bg-black/5">
          <ExternalLink size={16} /> Về trang web chính
        </Link>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-ink">
      <div className="flex min-h-screen">
        <div className="hidden lg:block">{Sidebar}</div>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="h-full bg-white shadow-xl">{Sidebar}</div>
            <button className="flex-1 bg-black/40" aria-label="Đóng" onClick={() => setMobileOpen(false)} />
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-black/5 bg-white px-4 md:px-6">
            <div className="flex items-center gap-3 text-sm font-semibold text-ink/60">
              <button type="button" className="rounded-lg p-2 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Menu">
                <Menu size={18} />
              </button>
              <span>Trang chủ</span>
              {crumbs.map((c) => (
                <span key={c} className="flex items-center gap-3">
                  <span>/</span>
                  <span className="text-ink">{c}</span>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin/account" className="hidden text-sm font-semibold sm:inline">{userName}</Link>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#3f7d3a] text-sm font-semibold text-white">{userInitial}</span>
              <form action={signOutAction}>
                <button className="rounded-lg px-2 py-1 text-sm font-semibold text-ink/60 hover:bg-black/5">Thoát</button>
              </form>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
