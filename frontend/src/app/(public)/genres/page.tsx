"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { GENRE_GRADIENTS, PublicEmptyState, emptyIcons } from "@/components/PublicStates";
import type { Genre } from "@/types";

function GenreCard({
  genre,
  gradientIndex,
}: {
  genre: Genre & { movie_count?: number };
  gradientIndex: number;
}) {
  const hasImage = !!genre.image_url;
  const gradient = GENRE_GRADIENTS[gradientIndex % GENRE_GRADIENTS.length];

  return (
    <Link
      href={`/movies?genre_id=${genre.id}`}
      className="group relative h-52 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/60"
    >
      <div className="absolute inset-0" style={{ background: gradient }} />

      {hasImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={genre.image_url}
          alt={genre.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5 transition-all duration-300 group-hover:from-black/90 group-hover:via-black/45" />

      <div className="absolute inset-x-0 bottom-0 flex flex-col p-4">
        {genre.description && (
          <p className="text-xs text-white/75 leading-snug mb-2 line-clamp-2 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            {genre.description}
          </p>
        )}
        <span className="font-outfit font-black text-white text-lg drop-shadow-lg leading-tight">
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
}

function GenrePageSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} className="h-52 rounded-2xl bg-white/10 animate-pulse" />
      ))}
    </div>
  );
}

export default function GenresPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["public-genres"],
    queryFn: () => apiClient.genres.list(),
    staleTime: 5 * 60 * 1000,
  });

  const genres = data?.genres || [];
  // Genres already sorted by movie_count DESC from API — top ones come first
  const withMovies = genres.filter((g) => (g.movie_count ?? 0) > 0);
  const empty = genres.filter((g) => (g.movie_count ?? 0) === 0);

  return (
    <main className="min-h-screen bg-bg-deep flex flex-col">
      <Header />

      <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full flex-1">
        <div className={cn("flex items-center gap-4", withMovies.length > 0 || isLoading ? "mb-12" : "mb-8")}>
          <div className="w-1.5 h-10 bg-brand-secondary rounded-full shadow-[0_0_10px_rgba(0,209,255,0.5)]" />
          <div>
            <h1 className="text-5xl font-outfit font-black text-white uppercase tracking-tight">
              All Genres
            </h1>
            <p className="text-text-dim mt-1">
              {isLoading ? "Loading…" : `${genres.length} genre${genres.length !== 1 ? "s" : ""} in the library`}
            </p>
          </div>
        </div>

        {isLoading ? (
          <GenrePageSkeleton />
        ) : genres.length === 0 ? (
          <PublicEmptyState
            icon={emptyIcons.layers}
            title="No genres yet"
            description="Genres will appear here once added in admin or imported from TMDb."
          />
        ) : (
          <div className="space-y-12">
            {withMovies.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {withMovies.map((genre, i) => (
                  <GenreCard key={genre.id} genre={genre} gradientIndex={i} />
                ))}
              </div>
            )}

            {empty.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-text-muted uppercase tracking-widest">
                  No movies yet
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {empty.map((genre, i) => (
                    <GenreCard
                      key={genre.id}
                      genre={genre}
                      gradientIndex={(withMovies.length + i) % GENRE_GRADIENTS.length}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
