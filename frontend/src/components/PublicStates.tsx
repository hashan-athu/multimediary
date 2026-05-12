"use client";

import { Film, Layers, Search, Users, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

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

export function CategoryGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="glass-panel rounded-3xl p-8 space-y-5">
          <SkeletonBlock className="w-14 h-14 rounded-2xl" />
          <SkeletonBlock className="h-5 w-2/3" />
          <SkeletonBlock className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function GenreGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonBlock key={i} className="h-32 rounded-2xl" />
      ))}
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
