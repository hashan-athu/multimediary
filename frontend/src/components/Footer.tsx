"use client";

import Link from "next/link";
import { Film, ExternalLink } from "lucide-react";
import { useCookieStore } from "@/store/cookieStore";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Image imports
import LogoFull from "@/assets/images/logo/multimediary-logo-desktop.svg";

const DOCS_URL =
  process.env.NEXT_PUBLIC_DOCS_URL || "http://localhost:3002/docs/";

const exploreLinks = [
  { name: "Home", href: "/", exact: true },
  { name: "All Movies", href: "/movies" },
  { name: "Categories", href: "/categories" },
  { name: "Genres", href: "/genres" },
  { name: "Actors", href: "/actors" },
];

const adminLinks = [
  { name: "Dashboard", href: "/admin/dashboard" },
  { name: "Manage Movies", href: "/admin/movies" },
  { name: "Sign In", href: "/admin/login" },
];

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms & Conditions", href: "/terms" },
  { name: "Cookie Policy", href: "/cookie-policy" },
];

export default function Footer() {
  const openPreferences = useCookieStore((s) => s.openPreferences);
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <footer className="bg-bg-surface border-t border-white/5 pt-20 pb-10 px-6 md:px-12 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1 space-y-6">
          <Link href="/" className="flex items-center gap-2 group w-fit">
            <Image
              src={LogoFull}
              alt="Multimediary logo"
              className="h-8 w-auto"
              width={386}
              height={40}
            />
          </Link>
          <p className="text-text-dim leading-relaxed text-sm">
            Your ultimate physical media library companion. Organise, search,
            and discover your collection with a cinematic experience.
          </p>
        </div>

        {/* Explore */}
        <div className="space-y-5">
          <h3 className="text-white font-bold text-sm uppercase tracking-wider">
            Explore
          </h3>
          <nav className="flex flex-col gap-3">
            {exploreLinks.map((link) => {
              const active = isActive(link.href, link.exact);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-sm transition-colors flex items-center gap-1.5",
                    active
                      ? "text-white font-semibold"
                      : "text-text-dim hover:text-white",
                  )}
                >
                  {active && (
                    <span className="inline-block w-1 h-1 rounded-full bg-brand-primary flex-shrink-0" />
                  )}
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Admin */}
        <div className="space-y-5">
          <h3 className="text-white font-bold text-sm uppercase tracking-wider">
            Admin
          </h3>
          <nav className="flex flex-col gap-3">
            <a
              href={DOCS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-dim hover:text-white transition-colors text-sm flex items-center gap-1.5 group"
            >
              Documentation
              <ExternalLink
                size={11}
                className="opacity-50 group-hover:opacity-100 transition-opacity"
              />
            </a>
            {adminLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-text-dim hover:text-white transition-colors text-sm"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Legal */}
        <div className="space-y-5">
          <h3 className="text-white font-bold text-sm uppercase tracking-wider">
            Legal
          </h3>
          <nav className="flex flex-col gap-3">
            {legalLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-text-dim hover:text-white transition-colors text-sm"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-text-muted">
        <p>© {new Date().getFullYear()} MULTIMEDIARY. ALL RIGHTS RESERVED.</p>
        <div className="flex items-center gap-6">
          <Link
            href="/privacy-policy"
            className="hover:text-text-dim transition-colors"
          >
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-text-dim transition-colors">
            Terms
          </Link>
          <button
            onClick={openPreferences}
            className="hover:text-text-dim transition-colors cursor-pointer"
          >
            Cookie Settings
          </button>
        </div>
      </div>
    </footer>
  );
}
