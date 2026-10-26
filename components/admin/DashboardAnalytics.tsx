"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition, type ReactNode } from "react";
import type { DashboardAnalytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";

function LineChart({ daily }: { daily: { day: number; count: number }[] }) {
  const width = 640;
  const height = 220;
  const pad = 28;
  const max = Math.max(...daily.map((d) => d.count), 5);
  const points = daily.map((d, i) => {
    const x = pad + (i / Math.max(daily.length - 1, 1)) * (width - pad * 2);
    const y = height - pad - (d.count / max) * (height - pad * 2);
    return { x, y, ...d };
  });
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const area = `${path} L ${points[points.length - 1]?.x || pad} ${height - pad} L ${pad} ${height - pad} Z`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full">
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const y = height - pad - t * (height - pad * 2);
        return (
          <g key={t}>
            <line x1={pad} x2={width - pad} y1={y} y2={y} stroke="#e5e7eb" strokeWidth="1" />
            <text x={8} y={y + 4} className="fill-ink/40 text-[10px] font-semibold">{Math.round(max * t)}</text>
          </g>
        );
      })}
      <path d={area} fill="rgba(63,125,58,0.12)" />
      <path d={path} fill="none" stroke="#3f7d3a" strokeWidth="3" />
      {points.filter((_, i) => i % Math.ceil(points.length / 10) === 0 || i === points.length - 1).map((p) => (
        <g key={p.day}>
          <circle cx={p.x} cy={p.y} r="4" fill="#3f7d3a" />
          <text x={p.x} y={height - 8} textAnchor="middle" className="fill-ink/45 text-[10px] font-semibold">D{p.day}</text>
        </g>
      ))}
    </svg>
  );
}

function Donut({ segments, center }: { segments: { value: number; color: string }[]; center: ReactNode }) {
  const total = Math.max(segments.reduce((s, x) => s + x.value, 0), 1);
  const r = 42;
  const c = 2 * Math.PI * r;
  const lengths = segments.map((seg) => (seg.value / total) * c);
  return (
    <div className="relative mx-auto h-40 w-40">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#e5e7eb" strokeWidth="14" />
        {segments.map((seg, i) => {
          const len = lengths[i];
          const offset = -lengths.slice(0, i).reduce((s, l) => s + l, 0);
          return (
            <circle key={i} cx="60" cy="60" r={r} fill="none" stroke={seg.color} strokeWidth="14" strokeDasharray={`${len} ${c - len}`} strokeDashoffset={offset} />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-center">{center}</div>
    </div>
  );
}

export function DashboardAnalyticsPanel({ initial }: { initial: DashboardAnalytics }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [month, setMonth] = useState(initial.month);
  const [year, setYear] = useState(initial.year);
  const [pending, startTransition] = useTransition();
  const deviceSum = initial.devices.desktop + initial.devices.mobile;
  const desktopPct = deviceSum ? Math.round((initial.devices.desktop / deviceSum) * 100) : 0;
  const mobilePct = deviceSum ? 100 - desktopPct : 0;
  const years = useMemo(() => {
    const y = new Date().getFullYear();
    return [y, y - 1, y - 2];
  }, []);

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-3">
        <div className="rounded-2xl border border-black/8 bg-white p-4 shadow-sm md:p-5 xl:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <span className="h-5 w-1.5 rounded-full bg-[#3f7d3a]" />
              Thống kê truy cập tháng {String(initial.month).padStart(2, "0")}/{initial.year}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => <option key={m} value={m}>Tháng {m}</option>)}
              </select>
              <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold">
                {years.map((y) => <option key={y} value={y}>Năm {y}</option>)}
              </select>
              <button
                type="button"
                disabled={pending}
                className="rounded-xl bg-[#3f7d3a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2f6230] disabled:opacity-60"
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("month", String(month));
                  params.set("year", String(year));
                  startTransition(() => router.push(`/admin?${params.toString()}`));
                }}
              >
                {pending ? "…" : "Thống kê"}
              </button>
            </div>
          </div>
          <LineChart daily={initial.daily} />
        </div>
        <div className="rounded-2xl border border-black/8 bg-white p-4 shadow-sm md:p-5">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold">
            <span className="h-5 w-1.5 rounded-full bg-[#3f7d3a]" />
            Thống kê truy cập
          </h2>
          <Donut
            segments={[
              { value: initial.online, color: "#22c55e" },
              { value: initial.week, color: "#3b82f6" },
              { value: initial.monthTotal, color: "#3f7d3a" },
              { value: initial.allTime, color: "#a855f7" },
            ]}
            center={<div><p className="text-xs font-semibold text-ink/45">Đang online</p><p className="text-2xl font-semibold text-ink">{initial.online}</p></div>}
          />
          <ul className="mt-4 space-y-2 text-sm font-semibold">
            {[
              { label: "Đang online", value: initial.online, color: "bg-emerald-500" },
              { label: "Trong tuần", value: initial.week, color: "bg-sky-500" },
              { label: "Trong tháng", value: initial.monthTotal, color: "bg-[#3f7d3a]" },
              { label: "Tổng truy cập", value: initial.allTime, color: "bg-violet-500" },
            ].map((item) => (
              <li key={item.label} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-ink/70"><span className={cn("h-2.5 w-2.5 rounded-full", item.color)} />{item.label}</span>
                <span>{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-black/8 bg-white p-4 shadow-sm md:p-5">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold"><span className="h-5 w-1.5 rounded-full bg-[#3f7d3a]" />Thống kê trình duyệt</h2>
          <ul className="space-y-3">
            {initial.browsers.map((b) => (
              <li key={b.name} className="flex items-center justify-between text-sm font-semibold">
                <span className="flex items-center gap-2 text-ink/70"><span className="h-2.5 w-2.5 rounded-full" style={{ background: b.color }} />{b.name}</span>
                <span>{b.count}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-black/8 bg-white p-4 shadow-sm md:p-5">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold"><span className="h-5 w-1.5 rounded-full bg-[#3f7d3a]" />Thống kê thiết bị</h2>
          <Donut
            segments={[
              { value: initial.devices.desktop, color: "#3b82f6" },
              { value: initial.devices.mobile, color: "#3f7d3a" },
            ]}
            center={<div><p className="text-2xl font-semibold">{desktopPct}%</p><p className="text-[10px] font-semibold text-ink/45">Máy tính</p></div>}
          />
          <div className="mt-4 grid grid-cols-2 gap-3 text-center text-sm font-semibold">
            <div className="rounded-xl bg-sky-50 p-3"><p className="text-sky-600">{desktopPct}%</p><p className="text-xs text-ink/50">{initial.devices.desktop} lượt · Máy tính</p></div>
            <div className="rounded-xl bg-amber-50 p-3"><p className="text-[#2f6230]">{mobilePct}%</p><p className="text-xs text-ink/50">{initial.devices.mobile} lượt · Điện thoại</p></div>
          </div>
        </div>
        <div className="rounded-2xl border border-black/8 bg-white p-4 shadow-sm md:p-5">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold"><span className="h-5 w-1.5 rounded-full bg-[#3f7d3a]" />Thống kê IP</h2>
          {initial.ips.length === 0 ? <p className="text-sm font-semibold text-ink/45">Chưa có dữ liệu.</p> : (
            <ul className="space-y-2.5">
              {initial.ips.map((row) => (
                <li key={row.ip} className="flex items-center justify-between text-sm font-semibold">
                  <span className="font-mono text-ink/70">{row.ip}</span>
                  <span className="text-[#3f7d3a]">{row.count} lần</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export function QuickLinkCards() {
  const items = [
    { href: "/admin/settings", title: "Cấu hình website", tone: "bg-sky-500", icon: "sliders" },
    { href: "/admin/account", title: "Tài khoản", tone: "bg-violet-500", icon: "user" },
    { href: "/admin/account/password", title: "Đổi mật khẩu", tone: "bg-[#3f7d3a]", icon: "key" },
    { href: "/admin/contacts", title: "Liên hệ", tone: "bg-emerald-500", icon: "mail" },
  ] as const;
  return (
    <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Link key={item.href} href={item.href} className="flex items-center gap-4 rounded-2xl border border-black/8 bg-white p-4 shadow-sm transition hover:border-[#3f7d3a]/40">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-white ${item.tone}`}>
            {item.icon === "sliders" && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M2 14h4M10 8h4M18 16h4" /></svg>}
            {item.icon === "user" && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21a8 8 0 0 0-16 0" /><circle cx="12" cy="7" r="4" /></svg>}
            {item.icon === "key" && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="15" r="4" /><path d="m11 12 9-9 2 2-3 1-1 3-3 1" /></svg>}
            {item.icon === "mail" && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>}
          </div>
          <div>
            <p className="font-semibold text-ink">{item.title}</p>
            <p className="text-sm font-semibold text-[#3f7d3a]">Xem chi tiết</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
