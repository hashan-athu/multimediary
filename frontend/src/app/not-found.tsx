import Link from "next/link";
import { Film, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-bg-deep flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-brand-secondary/5 rounded-full blur-3xl" />
      </div>

      {/* Giant 404 watermark */}
      <p
        aria-hidden
        className="absolute select-none font-outfit font-black text-white/[0.03] leading-none pointer-events-none"
        style={{ fontSize: "clamp(180px, 30vw, 360px)" }}
      >
        404
      </p>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 max-w-lg">
        <div className="w-20 h-20 rounded-3xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
          <Film size={36} className="text-brand-primary" />
        </div>

        <div className="space-y-3">
          <h1 className="text-6xl md:text-7xl font-outfit font-black text-white tracking-tight">
            Reel Not Found
          </h1>
          <p className="text-text-dim text-lg leading-relaxed">
            This page has gone missing from the projection booth. It may have been moved, deleted,
            or perhaps it never existed in the catalogue.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/" className="btn-primary px-8 py-4 text-base gap-3">
            <Home size={18} />
            Back to Home
          </Link>
          <Link href="/movies" className="btn-secondary px-8 py-4 text-base gap-3">
            <Search size={18} />
            Browse Movies
          </Link>
        </div>

        <p className="text-text-muted text-sm font-bold tracking-widest uppercase">
          Error 404 — Page Not Found
        </p>
      </div>
    </main>
  );
}
