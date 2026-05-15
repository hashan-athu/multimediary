"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, Menu, X, Film } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Image imports
import LogoFull from "@/assets/images/logo/multimediary-logo-desktop.svg";
import LogoSmall from "@/assets/images/logo/logo-md.png";

export default function Header() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen) searchInputRef.current?.focus();
  }, [isSearchOpen]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Movies", href: "/movies" },
    { name: "Categories", href: "/categories" },
    { name: "Actors", href: "/actors" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      router.push(`/movies?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 md:px-12 py-4",
        isScrolled
          ? "bg-bg-deep/80 backdrop-blur-xl border-b border-white/5 py-3"
          : "bg-linear-to-b from-bg-deep/80 to-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src={LogoSmall}
              alt="Multimediary logo"
              className="h-10 w-auto block md:hidden"
              width={40}
              height={40}
            />
            <Image
              src={LogoFull}
              alt="Multimediary logo"
              className="h-8 w-auto hidden md:block"
              width={386}
              height={40}
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-text-dim hover:text-white transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          {/* Search bar (desktop expandable) */}
          <AnimatePresence>
            {isSearchOpen ? (
              <motion.form
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 260, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleSearch}
                className="relative overflow-hidden"
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-4 pr-10 py-2 text-sm text-white placeholder:text-text-muted outline-none focus:border-brand-secondary/50"
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-white"
                >
                  <X size={16} />
                </button>
              </motion.form>
            ) : (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setIsSearchOpen(true)}
                className="text-text-dim hover:text-white transition-colors"
                aria-label="Open search"
              >
                <Search size={20} />
              </motion.button>
            )}
          </AnimatePresence>

          <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />

          <Link
            href="/admin"
            className="hidden md:flex items-center gap-2 text-sm font-bold text-text-dim hover:text-white transition-colors"
          >
            Admin
          </Link>

          <button
            className="lg:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-bg-surface border-b border-white/5 p-6 flex flex-col gap-4 shadow-2xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-bold text-text-dim hover:text-white"
              >
                {link.name}
              </Link>
            ))}
            <form onSubmit={handleSearch} className="mt-2">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-text-muted outline-none"
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
