import { prisma } from "@/lib/prisma";

export type DashboardAnalytics = {
  month: number;
  year: number;
  daily: { day: number; count: number }[];
  online: number;
  week: number;
  monthTotal: number;
  allTime: number;
  browsers: { name: string; count: number; color: string }[];
  devices: { desktop: number; mobile: number };
  ips: { ip: string; count: number }[];
};

const BROWSER_COLORS: Record<string, string> = {
  Chrome: "#22c55e",
  "Microsoft Edge": "#3b82f6",
  "Internet Explorer": "#0ea5e9",
  "Mozilla Firefox": "#f97316",
  Safari: "#a855f7",
  Opera: "#ef4444",
  Khác: "#94a3b8",
};

export function detectBrowser(ua: string) {
  const u = ua.toLowerCase();
  if (u.includes("edg/")) return "Microsoft Edge";
  if (u.includes("opr/") || u.includes("opera")) return "Opera";
  if (u.includes("chrome") && !u.includes("edg/")) return "Chrome";
  if (u.includes("safari") && !u.includes("chrome")) return "Safari";
  if (u.includes("firefox")) return "Mozilla Firefox";
  if (u.includes("trident") || u.includes("msie")) return "Internet Explorer";
  return "Khác";
}

export function detectDevice(ua: string) {
  return /mobile|android|iphone|ipad|ipod/i.test(ua) ? "mobile" : "desktop";
}

export async function getDashboardAnalytics(month?: number, year?: number): Promise<DashboardAnalytics> {
  const now = new Date();
  const vnNow = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
  }).format(now);
  const [vnYear, vnMonth] = vnNow.split("-").map(Number);
  const m = month || vnMonth;
  const y = year || vnYear;
  const start = new Date(Date.UTC(y, m - 1, 1, -7, 0, 0));
  const end = new Date(Date.UTC(y, m, 1, -7, 0, 0));
  const days = new Date(y, m, 0).getDate();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const onlineSince = new Date(now.getTime() - 5 * 60 * 1000);

  const [monthLogs, online, week, allTime, browsersRaw, devicesRaw, ipsRaw] = await Promise.all([
    prisma.visitLog.findMany({ where: { createdAt: { gte: start, lt: end } }, select: { createdAt: true } }),
    prisma.visitLog.count({ where: { createdAt: { gte: onlineSince } } }),
    prisma.visitLog.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.visitLog.count(),
    prisma.visitLog.groupBy({ by: ["browser"], _count: { browser: true }, orderBy: { _count: { browser: "desc" } } }),
    prisma.visitLog.groupBy({ by: ["device"], _count: { device: true } }),
    prisma.visitLog.groupBy({
      by: ["ip"],
      where: { ip: { not: null } },
      _count: { ip: true },
      orderBy: { _count: { ip: "desc" } },
      take: 8,
    }),
  ]);

  const daily = Array.from({ length: days }, (_, i) => ({ day: i + 1, count: 0 }));
  const dayFmt = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh", day: "2-digit" });
  for (const log of monthLogs) {
    const day = Number(dayFmt.format(log.createdAt));
    if (daily[day - 1]) daily[day - 1].count += 1;
  }

  const known = ["Chrome", "Microsoft Edge", "Internet Explorer", "Mozilla Firefox"];
  const browsers = known.map((name) => ({
    name,
    count: browsersRaw.find((row) => row.browser === name)?._count.browser || 0,
    color: BROWSER_COLORS[name],
  }));

  return {
    month: m,
    year: y,
    daily,
    online,
    week,
    monthTotal: monthLogs.length,
    allTime,
    browsers,
    devices: {
      desktop: devicesRaw.find((row) => row.device === "desktop")?._count.device || 0,
      mobile: devicesRaw.find((row) => row.device === "mobile")?._count.device || 0,
    },
    ips: ipsRaw.map((row) => ({ ip: row.ip || "", count: row._count.ip })),
  };
}
