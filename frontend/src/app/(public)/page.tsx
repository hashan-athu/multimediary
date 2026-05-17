"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import SearchFilter from "@/components/SearchFilter";
import MovieSection from "@/components/MovieSection";
import Footer from "@/components/Footer";
import { ChevronRight, Film, Users, Clapperboard, Disc3, HardDrive } from "lucide-react";
import { useState, useMemo } from "react";
import { MovieParams } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  GenreGridSkeleton,
  GenreBentoGrid,
  CategoryBentoSkeleton,
  CategoryBentoGrid,
  HomeSkeleton,
  PublicEmptyState,
  emptyIcons,
} from "@/components/PublicStates";

export default function Home() {
  const [filterParams, setFilterParams] = useState<Partial<MovieParams>>({});

  const { data: moviesData, isLoading } = useQuery({
    queryKey: ["public-movies", filterParams],
    queryFn: () => apiClient.movies.list({ per_page: 24, ...filterParams }),
  });

  const { data: genreData, isLoading: genresLoading } = useQuery({
    queryKey: ["public-genres"],
    queryFn: () => apiClient.genres.list(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: categoryData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["public-categories"],
    queryFn: () => apiClient.categories.list(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: statsData } = useQuery({
    queryKey: ["public-stats"],
    queryFn: () => apiClient.stats(),
    staleTime: 10 * 60 * 1000,
  });

  const allMovies = moviesData?.movies || [];
  const genres = genreData?.genres || [];
  const categories = categoryData?.categories || [];
  const featuredMovies = allMovies.slice(0, 5);
  const trendingMovies = [...allMovies].reverse().slice(0, 12);

  const hasActiveFilters = Object.keys(filterParams).length > 0;

  const storageFormatted = useMemo(() => {
    const gb = statsData?.totals?.storage_gb ?? 0;
    return gb >= 1000 ? `${(gb / 1000).toFixed(1)} TB` : `${Math.round(gb)} GB`;
  }, [statsData]);

  return (
    <main className="min-h-screen bg-bg-deep flex flex-col">
      <Header />

      {isLoading && !hasActiveFilters ? (
        <HomeSkeleton />
      ) : (
        <>
        <h1 className="hidden">Multimediary - Your Ultimate Personal Movies, Games Collection</h1>
          {!hasActiveFilters && <HeroCarousel movies={featuredMovies} />}

          <div
            className={`relative z-20 space-y-20 pb-20 md:space-y-24 ${!hasActiveFilters ? "mt-4 md:mt-6" : "mt-24"}`}
          >
            <SearchFilter
              onFilter={(params) => setFilterParams(params)}
              initialParams={filterParams}
            />

            <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-32">
              <MovieSection
                title={hasActiveFilters ? "Search Results" : "Latest Releases"}
                movies={allMovies}
                viewAllHref={hasActiveFilters ? undefined : "/movies"}
                emptyTitle={
                  hasActiveFilters
                    ? "No matching movies"
                    : "No latest releases yet"
                }
                emptyDescription={
                  hasActiveFilters
                    ? "No live data matches these filters. Try changing the search or clearing the filters."
                    : "There are no movies in the public library yet. Once movies are added in admin, they will appear here."
                }
              />

              {!hasActiveFilters && (
                <>
                  {/* Genre Bento Grid */}
                  <section className="space-y-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-1.5 h-8 bg-brand-secondary rounded-full shadow-[0_0_10px_rgba(0,209,255,0.5)]" />
                        <h2 className="text-3xl font-outfit font-black tracking-tight text-white uppercase">
                          Browse by Genre
                        </h2>
                      </div>
                      <Link
                        href="/genres"
                        className="flex items-center gap-2 text-sm font-bold text-text-dim hover:text-brand-secondary transition-colors group ml-6 sm:ml-0"
                      >
                        VIEW ALL
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                    {genresLoading ? (
                      <GenreGridSkeleton />
                    ) : genres.length === 0 ? (
                      <PublicEmptyState
                        icon={emptyIcons.layers}
                        title="No genres yet"
                        description="Genre shortcuts will appear here after genres are added or imported from TMDB."
                      />
                    ) : (
                      <GenreBentoGrid genres={genres} />
                    )}
                  </section>

                  {/* Category Bento Grid */}
                  <section className="space-y-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-1.5 h-8 bg-brand-primary rounded-full shadow-[0_0_10px_rgba(229,9,20,0.5)]" />
                        <h2 className="text-3xl font-outfit font-black tracking-tight text-white uppercase">
                          Browse by Category
                        </h2>
                      </div>
                      <Link
                        href="/categories"
                        className="flex items-center gap-2 text-sm font-bold text-text-dim hover:text-brand-primary transition-colors group ml-6 sm:ml-0"
                      >
                        VIEW ALL
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                    {categoriesLoading ? (
                      <CategoryBentoSkeleton />
                    ) : categories.length === 0 ? (
                      <PublicEmptyState
                        icon={emptyIcons.layers}
                        title="No categories yet"
                        description="Category shortcuts will appear here after categories are added in admin."
                      />
                    ) : (
                      <CategoryBentoGrid categories={categories} />
                    )}
                  </section>

                  <MovieSection
                    title="Top Trending"
                    movies={trendingMovies}
                    viewAllHref="/movies"
                    emptyTitle="No trending movies yet"
                    emptyDescription="Trending rows need movie data first. Add titles in admin and this section will populate automatically."
                  />

                  {/* Collection Stats Section */}
                  <section className="relative rounded-3xl overflow-hidden">
                    <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-brand-primary/20 via-transparent to-brand-secondary/20" />
                    <div className="relative rounded-3xl bg-bg-surface/50 backdrop-blur-sm border border-white/8 p-10 md:p-14 space-y-10">

                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-4">
                          <div className="w-1.5 h-8 bg-accent rounded-full shadow-[0_0_10px_rgba(245,189,50,0.5)]" />
                          <h2 className="text-3xl font-outfit font-black text-white uppercase tracking-tight">
                            The Collection
                          </h2>
                        </div>
                        {statsData?.totals?.year_range && (
                          <span className="text-text-dim font-bold tracking-widest text-sm uppercase ml-6 sm:ml-0">
                            {statsData.totals.year_range}
                          </span>
                        )}
                      </div>

                      {/* Stat cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {[
                          {
                            icon: Film,
                            label: "Movies",
                            value: statsData?.totals?.movies ?? "—",
                            color: "text-brand-primary",
                            border: "hover:border-brand-primary/30",
                          },
                          {
                            icon: Users,
                            label: "Actors",
                            value: statsData?.totals?.actors ?? "—",
                            color: "text-brand-secondary",
                            border: "hover:border-brand-secondary/30",
                          },
                          {
                            icon: Clapperboard,
                            label: "Directors",
                            value: statsData?.totals?.directors ?? "—",
                            color: "text-accent",
                            border: "hover:border-accent/30",
                          },
                          {
                            icon: Disc3,
                            label: "Disks",
                            value: statsData?.totals?.disks ?? "—",
                            color: "text-text-dim",
                            border: "hover:border-white/20",
                          },
                          {
                            icon: HardDrive,
                            label: "Storage",
                            value: storageFormatted,
                            color: "text-white",
                            border: "hover:border-white/20",
                          },
                        ].map(({ icon: Icon, label, value, color, border }) => (
                          <div
                            key={label}
                            className={cn(
                              "glass-panel rounded-2xl p-5 space-y-3 transition-colors",
                              border,
                            )}
                          >
                            <Icon size={20} className={color} />
                            <p className="text-3xl font-outfit font-black text-white tabular-nums">
                              {value}
                            </p>
                            <p className="text-xs font-black uppercase tracking-widest text-text-dim">
                              {label}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Formats */}
                      {statsData?.by_format && statsData.by_format.length > 0 && (
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-xs font-black uppercase tracking-widest text-text-muted">
                            Format
                          </span>
                          {statsData.by_format.map((f) => (
                            <span
                              key={f.name}
                              className="flex items-center gap-1.5 text-xs font-bold bg-white/5 border border-white/8 px-3 py-1.5 rounded-full"
                            >
                              <span className="text-white">{f.name}</span>
                              <span className="text-text-muted">·</span>
                              <span className="text-text-dim">{f.count}</span>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Top Genres */}
                      {statsData?.top_genres && statsData.top_genres.length > 0 && (
                        <div className="space-y-4 pt-2 border-t border-white/5">
                          <p className="text-xs font-black uppercase tracking-widest text-text-muted">
                            Top Genres
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {statsData.top_genres.map((g) => {
                              const genre = genres.find((gr) => gr.name === g.name);
                              const href = genre
                                ? `/movies?genre_id=${genre.id}`
                                : "/genres";
                              return (
                                <Link
                                  key={g.name}
                                  href={href}
                                  className="flex items-center gap-2 text-sm font-bold text-text-dim border border-white/10 bg-white/5 px-4 py-2 rounded-full hover:border-brand-secondary/40 hover:text-white hover:bg-brand-secondary/10 transition-all"
                                >
                                  {g.name}
                                  <span className="text-xs text-text-muted font-semibold">
                                    {g.count}
                                  </span>
                                </Link>
                              );
                            })}
                            <Link
                              href="/genres"
                              className="flex items-center gap-1.5 text-sm font-bold text-text-muted border border-white/5 bg-white/3 px-4 py-2 rounded-full hover:text-white transition-colors"
                            >
                              All Genres
                              <ChevronRight size={14} />
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                </>
              )}
            </div>
          </div>
        </>
      )}

      <Footer />
    </main>
  );
}
