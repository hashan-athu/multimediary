"use client";

import { Film, Layers, Search, Users, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import Link from "next/link";
import type { Genre, Category } from "@/types";

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-white/10", className)} />;
}

export function PublicEmptyState({
  icon: Icon = Film,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("glass-panel rounded-3xl px-6 py-16 text-center flex flex-col items-center gap-5", className)}>
      <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
        <Icon size={36} className="text-text-muted" />
      </div>
      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-outfit font-black text-white uppercase tracking-tight">{title}</h2>
        <p className="text-text-dim leading-relaxed">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function MovieGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="space-y-3">
          <SkeletonBlock className="aspect-[2/3] rounded-2xl" />
          <SkeletonBlock className="h-4 w-4/5" />
          <SkeletonBlock className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function PeopleGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="glass-panel rounded-2xl p-4 text-center space-y-3">
          <SkeletonBlock className="w-20 h-20 rounded-full mx-auto" />
          <SkeletonBlock className="h-4 w-3/4 mx-auto" />
          <SkeletonBlock className="h-3 w-1/2 mx-auto" />
        </div>
      ))}
    </div>
  );
}

// Category bento: 4-col grid, up to 6 items
// 5 items → 2 clean rows; 6 items → 2 rows + full-width banner
const CATEGORY_BENTO_CLASSES = [
  "col-span-1 h-44 md:col-span-2 md:row-span-2 md:h-auto",
  "col-span-1 h-44 md:col-span-1 md:row-span-1 md:h-auto",
  "col-span-1 h-44 md:col-span-1 md:row-span-1 md:h-auto",
  "col-span-1 h-44 md:col-span-1 md:row-span-1 md:h-auto",
  "col-span-1 h-44 md:col-span-1 md:row-span-1 md:h-auto",
  "col-span-2 h-44 md:col-span-4 md:row-span-1 md:h-auto",
];

export const CATEGORY_GRADIENTS = [
  "linear-gradient(135deg, #8B0A02, #2A0000)",
  "linear-gradient(135deg, #002B6B, #00050D)",
  "linear-gradient(135deg, #5C2B00, #1A0800)",
  "linear-gradient(135deg, #2B004D, #070010)",
  "linear-gradient(135deg, #003D28, #000A05)",
  "linear-gradient(135deg, #4D1A00, #0F0500)",
  "linear-gradient(135deg, #1A004D, #050010)",
];

export function CategoryBentoSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:[grid-auto-rows:160px]">
      {CATEGORY_BENTO_CLASSES.map((cls, i) => (
        <SkeletonBlock key={i} className={cn("rounded-2xl", cls)} />
      ))}
    </div>
  );
}

export function CategoryBentoGrid({ categories }: { categories: (Category & { movie_count?: number })[] }) {
  const capped = categories.slice(0, 6);
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:[grid-auto-rows:160px]">
      {capped.map((category, i) => {
        const sizeClass = CATEGORY_BENTO_CLASSES[i];
        const hasImage = !!category.image_url;
        const gradient = CATEGORY_GRADIENTS[i % CATEGORY_GRADIENTS.length];
        const isHero = i === 0;
        const isBanner = i === 5;

        return (
          <Link
            key={category.id}
            href={`/movies?category_id=${category.id}`}
            className={cn(
              "group relative rounded-2xl overflow-hidden transition-all duration-300",
              "hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/60",
              sizeClass
            )}
          >
            <div className="absolute inset-0" style={{ background: gradient }} />

            {hasImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={category.image_url}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5 transition-all duration-300 group-hover:from-black/90 group-hover:via-black/45" />

            <div className={cn(
              "absolute inset-0 flex flex-col p-4",
              isBanner ? "items-center justify-center text-center" : "justify-end"
            )}>
              {category.description && (
                <p className={cn(
                  "text-white/75 leading-snug mb-2",
                  "opacity-0 translate-y-2 transition-all duration-300",
                  "group-hover:opacity-100 group-hover:translate-y-0",
                  isHero ? "text-sm line-clamp-3" : "text-xs line-clamp-2"
                )}>
                  {category.description}
                </p>
              )}

              <span className={cn(
                "font-outfit font-black text-white drop-shadow-lg leading-tight",
                isHero ? "text-2xl md:text-3xl" : isBanner ? "text-xl md:text-2xl" : "text-base md:text-lg"
              )}>
                {category.name}
              </span>

              {category.movie_count !== undefined && (
                <span className="text-[10px] text-white/50 mt-0.5 font-medium">
                  {category.movie_count} {category.movie_count === 1 ? "movie" : "movies"}
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export function CategoryGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonBlock key={i} className="h-52 rounded-2xl" />
      ))}
    </div>
  );
}

// 10-item bento layout fills a 4-col grid perfectly: rows trace to 4×4=16 cells
// Row 1: [0:2×2][1][2]  Row 2: [0:2×2][3:1×2][4]  Row 3: [5:2×1][3:cont][6]  Row 4: [7][8][9:2×1]
const BENTO_CLASSES = [
  "col-span-1 h-44 md:col-span-2 md:row-span-2 md:h-auto",
  "col-span-1 h-44 md:col-span-1 md:row-span-1 md:h-auto",
  "col-span-1 h-44 md:col-span-1 md:row-span-1 md:h-auto",
  "col-span-1 h-44 md:col-span-1 md:row-span-2 md:h-auto",
  "col-span-1 h-44 md:col-span-1 md:row-span-1 md:h-auto",
  "col-span-1 h-44 md:col-span-2 md:row-span-1 md:h-auto",
  "col-span-1 h-44 md:col-span-1 md:row-span-1 md:h-auto",
  "col-span-1 h-44 md:col-span-1 md:row-span-1 md:h-auto",
  "col-span-1 h-44 md:col-span-1 md:row-span-1 md:h-auto",
  "col-span-1 h-44 md:col-span-2 md:row-span-1 md:h-auto",
];

// Cinematic dark gradients — used as fallback when no image is set
export const GENRE_GRADIENTS = [
  "linear-gradient(135deg, #7B0A02, #1A0000)",
  "linear-gradient(135deg, #003B7A, #000D1A)",
  "linear-gradient(135deg, #6B3600, #1A0C00)",
  "linear-gradient(135deg, #3B0070, #0A0020)",
  "linear-gradient(135deg, #004D2E, #001A0F)",
  "linear-gradient(135deg, #8B3A00, #1A0C00)",
  "linear-gradient(135deg, #004D5C, #000D10)",
  "linear-gradient(135deg, #5C0040, #100005)",
  "linear-gradient(135deg, #3D3D00, #0A0A00)",
  "linear-gradient(135deg, #1A1A4A, #050508)",
];

export function GenreGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:[grid-auto-rows:160px]">
      {BENTO_CLASSES.map((cls, i) => (
        <SkeletonBlock key={i} className={cn("rounded-2xl", cls)} />
      ))}
    </div>
  );
}

export function GenreBentoGrid({ genres }: { genres: (Genre & { movie_count?: number })[] }) {
  const capped = genres.slice(0, 10);
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:[grid-auto-rows:160px]">
      {capped.map((genre, i) => {
        const sizeClass = BENTO_CLASSES[i];
        const hasImage = !!genre.image_url;
        const gradient = GENRE_GRADIENTS[i % GENRE_GRADIENTS.length];
        const isHero = i === 0;

        return (
          <Link
            key={genre.id}
            href={`/movies?genre_id=${genre.id}`}
            className={cn(
              "group relative rounded-2xl overflow-hidden transition-all duration-300",
              "hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/60",
              sizeClass
            )}
          >
            {/* Gradient base — always present, image layers on top */}
            <div
              className="absolute inset-0"
              style={{ background: gradient }}
            />

            {/* Photo (if set) */}
            {hasImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={genre.image_url}
                alt={genre.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            )}

            {/* Dark vignette overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5 transition-all duration-300 group-hover:from-black/90 group-hover:via-black/45" />

            {/* Content pinned to bottom */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col p-4">
              {/* Description — slides up on hover */}
              {genre.description && (
                <p className={cn(
                  "text-white/75 leading-snug mb-2",
                  "opacity-0 translate-y-2 transition-all duration-300",
                  "group-hover:opacity-100 group-hover:translate-y-0",
                  isHero ? "text-sm line-clamp-3" : "text-xs line-clamp-2"
                )}>
                  {genre.description}
                </p>
              )}

              <span className={cn(
                "font-outfit font-black text-white drop-shadow-lg leading-tight",
                isHero ? "text-2xl md:text-3xl" : "text-base md:text-lg"
              )}>
                {genre.name}
              </span>

              {genre.movie_count !== undefined && (
                <span className="text-[10px] text-white/50 mt-0.5 font-medium">
                  {genre.movie_count} {genre.movie_count === 1 ? "movie" : "movies"}
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <div className="space-y-24 pb-20">
      <HeroSkeleton />
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-24">
        <SectionSkeleton />
        <SectionSkeleton />
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <section className="relative h-[90vh] w-full overflow-hidden bg-bg-surface">
      <div className="absolute inset-0 bg-gradient-to-r from-bg-deep via-bg-deep/70 to-bg-surface" />
      <div className="relative h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center">
        <div className="max-w-2xl space-y-6">
          <SkeletonBlock className="h-7 w-40" />
          <SkeletonBlock className="h-16 md:h-24 w-full" />
          <SkeletonBlock className="h-5 w-3/4" />
          <SkeletonBlock className="h-5 w-1/2" />
          <div className="flex gap-4 pt-4">
            <SkeletonBlock className="h-14 w-40 rounded-full" />
            <SkeletonBlock className="h-14 w-40 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function SectionSkeleton() {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <SkeletonBlock className="w-1.5 h-8" />
        <SkeletonBlock className="h-8 w-56" />
      </div>
      <MovieGridSkeleton />
    </section>
  );
}

export function DetailSkeleton({ tone = "primary" }: { tone?: "primary" | "secondary" }) {
  const accentClass = tone === "secondary" ? "bg-brand-secondary/30" : "bg-brand-primary/30";
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-14">
      <SkeletonBlock className="h-4 w-32" />
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10">
        <SkeletonBlock className="hidden md:block aspect-[2/3] rounded-2xl" />
        <div className="space-y-6">
          <SkeletonBlock className={cn("h-6 w-32", accentClass)} />
          <SkeletonBlock className="h-16 w-full max-w-2xl" />
          <SkeletonBlock className="h-5 w-3/4" />
          <div className="flex flex-wrap gap-4">
            <SkeletonBlock className="h-8 w-24" />
            <SkeletonBlock className="h-8 w-24" />
            <SkeletonBlock className="h-8 w-24" />
          </div>
          <SkeletonBlock className="h-24 w-full max-w-3xl" />
        </div>
      </div>
      <MovieGridSkeleton count={6} />
    </div>
  );
}

export const emptyIcons = {
  films: Film,
  layers: Layers,
  search: Search,
  users: Users,
};
