import Link from "next/link";
import { Film } from "lucide-react";

const exploreLinks = [
  { name: "Home", href: "/" },
  { name: "All Movies", href: "/movies" },
  { name: "Categories", href: "/categories" },
  { name: "Actors", href: "/actors" },
];

export default function Footer() {
  return (
    <footer className="bg-bg-surface border-t border-white/5 pt-20 pb-10 px-6 md:px-12 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(229,9,20,0.3)]">
              <Film className="text-white" size={22} />
            </div>
            <span className="font-outfit text-xl font-bold tracking-tight text-white">
              MULTI<span className="text-brand-primary">MEDIARY</span>
            </span>
          </Link>
          <p className="text-text-dim leading-relaxed">
            Your ultimate physical media library companion. Organize, search, and discover your collection with a cinematic experience.
          </p>
        </div>

        <div className="space-y-6">
          <h3 className="text-white font-bold text-lg uppercase tracking-wider">Explore</h3>
          <nav className="flex flex-col gap-4">
            {exploreLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-text-dim hover:text-white transition-colors">
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="space-y-6">
          <h3 className="text-white font-bold text-lg uppercase tracking-wider">Admin</h3>
          <nav className="flex flex-col gap-4">
            <Link href="/admin/dashboard" className="text-text-dim hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/admin/movies" className="text-text-dim hover:text-white transition-colors">
              Manage Movies
            </Link>
            <Link href="/admin/login" className="text-text-dim hover:text-white transition-colors">
              Sign In
            </Link>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-text-muted">
        <p>© {new Date().getFullYear()} MULTIMEDIARY. ALL RIGHTS RESERVED.</p>
        <p className="text-text-muted">Physical media library management system.</p>
      </div>
    </footer>
  );
}
