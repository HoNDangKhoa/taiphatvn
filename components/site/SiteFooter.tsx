import Link from "next/link";
import { Facebook, Instagram, Mail } from "lucide-react";
import type { FooterContent } from "@/lib/home";
import type { SiteSetting } from "@prisma/client";

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
      <path d="M14.5 3c.4 2.4 1.8 4 4.2 4.3v2.4c-1.5 0-2.9-.5-4.1-1.3v6.7c0 3.4-2.6 6.1-6.1 6.1S2.4 18.5 2.4 15.1c0-3.3 2.5-6 5.8-6.1v2.5c-1.8.1-3.3 1.6-3.3 3.5 0 2 1.6 3.6 3.6 3.6s3.5-1.6 3.5-3.6V3h2.5Z" />
    </svg>
  );
}

export function SiteFooter({
  footer,
  settings,
}: {
  footer: FooterContent;
  settings: SiteSetting;
}) {
  const socials = [
    { href: settings.facebook, icon: <Facebook size={16} /> },
    { href: settings.instagram, icon: <Instagram size={16} /> },
    { href: settings.tiktok, icon: <TikTokIcon /> },
    { href: settings.email ? `mailto:${settings.email}` : "", icon: <Mail size={16} /> },
  ].filter((s) => s.href);
  const web = settings.website?.replace(/^https?:\/\//, "") || "";

  return (
    <footer className="relative overflow-hidden bg-[#8B1E1F] text-white">
      <div className="pointer-events-none absolute -bottom-10 -left-8 h-40 w-40 rotate-[-20deg] rounded-[40%] bg-[#c45a45]/40 blur-2xl" />
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-14 md:grid-cols-[180px_1.3fr_.8fr_.8fr] md:px-10">
        <Link href="/">
          <img src={settings.logoUrl || "/media/logo.png"} alt="Kim Khánh" className="h-24 w-24 rounded-full bg-white object-contain" />
        </Link>
        <div>
          <h3 className="text-sm font-semibold tracking-[0.16em] uppercase">{footer.infoTitle}</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/85">
            <li>Add: {settings.address}</li>
            <li>
              Phone:{" "}
              <a className="underline-offset-2 hover:underline" href={`tel:${settings.phone?.replace(/\s/g, "")}`}>
                {settings.phone}
              </a>
            </li>
            <li>
              Mail:{" "}
              <a className="underline-offset-2 hover:underline" href={`mailto:${settings.email}`}>
                {settings.email}
              </a>
            </li>
            <li>
              Web:{" "}
              <a className="underline-offset-2 hover:underline" href={settings.website || "/"}>
                {web}
              </a>
            </li>
            <li>MST: {settings.taxCode}</li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold tracking-[0.16em] uppercase">{footer.linksTitle}</h3>
          <ul className="mt-4 space-y-2 text-sm tracking-wide text-white/90 uppercase">
            {footer.links.map((link) => (
              <li key={link.id}>
                <Link href={link.href} className="hover:underline">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold tracking-[0.16em] uppercase">{footer.socialTitle}</h3>
          <div className="mt-4 flex gap-2">
            {socials.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#8B1E1F] transition hover:scale-105"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
      <p className="px-4 pb-8 text-center text-xs text-white/75">{settings.copyright}</p>
    </footer>
  );
}
