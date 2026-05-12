"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import SearchFilter from "@/components/SearchFilter";
import MovieSection from "@/components/MovieSection";
import Footer from "@/components/Footer";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { MovieParams } from "@/types";
import Link from "next/link";
import { GenreGridSkeleton, HomeSkeleton, PublicEmptyState, emptyIcons } from "@/components/PublicStates";

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

  const allMovies = moviesData?.movies || [];
  const genres = genreData?.genres || [];
  const featuredMovies = allMovies.slice(0, 5);
  const trendingMovies = [...allMovies].reverse().slice(0, 12);

  const hasActiveFilters = Object.keys(filterParams).length > 0;

  return (
    <main className="min-h-screen bg-bg-deep flex flex-col">
      <Header />

      {isLoading && !hasActiveFilters ? (
        <HomeSkeleton />
      ) : (
        <>
          {!hasActiveFilters && <HeroCarousel movies={featuredMovies} />}

          <div className={`relative z-20 space-y-24 pb-20 ${!hasActiveFilters ? "-mt-32" : "mt-24"}`}>
            <SearchFilter
              onFilter={(params) => setFilterParams(params)}
              initialParams={filterParams}
            />

            <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-32">
              <MovieSection
                title={hasActiveFilters ? "Search Results" : "Latest Releases"}
                movies={allMovies}
                viewAllHref={hasActiveFilters ? undefined : "/movies"}
                emptyTitle={hasActiveFilters ? "No matching movies" : "No latest releases yet"}
                emptyDescription={
                  hasActiveFilters
                    ? "No live data matches these filters. Try changing the search or clearing the filters."
                    : "There are no movies in the public library yet. Once movies are added in admin, they will appear here."
                }
              />

              {!hasActiveFilters && (
                <>
                  {/* Genre Grid */}
                  <section className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-1.5 h-8 bg-brand-secondary rounded-full shadow-[0_0_10px_rgba(0,209,255,0.5)]" />
                      <h2 className="text-3xl font-outfit font-black tracking-tight text-white uppercase">
                        Browse by Genre
                      </h2>
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
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {genres.slice(0, 12).map((genre) => (
                        <Link
                          key={genre.id}
                          href={`/movies?genre_id=${genre.id}`}
                          className="group relative h-32 rounded-2xl overflow-hidden glass-panel hover:border-brand-secondary/50 transition-all flex items-center justify-center"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary/10 to-transparent group-hover:from-brand-secondary/20 transition-all" />
                          <div className="relative text-center px-2">
                            <span className="font-bold text-lg text-white group-hover:scale-110 transition-transform block">
                              {genre.name}
                            </span>
                            {genre.movie_count !== undefined && (
                              <span className="text-[10px] text-text-dim mt-1 block">
                                {genre.movie_count} movies
                              </span>
                            )}
                          </div>
                        </Link>
                        ))}
                      </div>
                    )}
                  </section>

                  <MovieSection
                    title="Top Trending"
                    movies={trendingMovies}
                    viewAllHref="/movies"
                    emptyTitle="No trending movies yet"
                    emptyDescription="Trending rows need movie data first. Add titles in admin and this section will populate automatically."
                  />

                  {/* Promo Section */}
                  <section className="relative rounded-[40px] overflow-hidden p-12 md:p-24 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/40 to-brand-secondary/40 animate-gradient-x" />
                    <div className="absolute inset-0 bg-bg-surface/80 backdrop-blur-3xl" />
                    <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                      <Sparkles className="text-accent w-16 h-16 animate-bounce" />
                      <h2 className="text-5xl md:text-7xl font-outfit font-black text-white max-w-4xl leading-tight">
                        DISCOVER THE TRUE <span className="text-brand-primary">CINEMATIC</span> POWER AT YOUR FINGERTIPS
                      </h2>
                      <p className="text-xl text-text-dim max-w-2xl">
                        Browse thousands of physical media titles with the ultimate cinematic experience.
                      </p>
                      <Link href="/movies" className="btn-primary py-5 px-16 text-xl">
                        EXPLORE ALL MOVIES
                      </Link>
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
