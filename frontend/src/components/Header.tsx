"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, User, Bell, Film } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Movies", href: "/movies" },
    { name: "Categories", href: "/categories" },
    { name: "Actors", href: "/actors" },
    { name: "My List", href: "/my-list" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 md:px-12 py-4",
        isScrolled 
          ? "bg-bg-deep/80 backdrop-blur-xl border-b border-white/5 py-3" 
          : "bg-gradient-to-b from-bg-deep/80 to-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(229,9,20,0.3)] group-hover:scale-110 transition-transform">
              <Film className="text-white" size={22} />
            </div>
            <span className="font-outfit text-xl font-bold tracking-tight text-white hidden sm:block">
              MULTI<span className="text-brand-primary">MEDIARY</span>
            </span>
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
          <button className="text-text-dim hover:text-white transition-colors">
            <Search size={20} />
          </button>
          <button className="text-text-dim hover:text-white transition-colors relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-primary rounded-full" />
          </button>
          
          <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />
          
          <button className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/5 group-hover:bg-white/20 transition-colors">
              <User size={16} />
            </div>
            <span className="text-sm font-bold text-white hidden md:block">Guest</span>
          </button>

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
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
