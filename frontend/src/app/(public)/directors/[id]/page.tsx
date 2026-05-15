"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import { motion } from "framer-motion";
import { ChevronLeft, User, Users } from "lucide-react";
import Link from "next/link";
import { DetailSkeleton, PublicEmptyState, emptyIcons } from "@/components/PublicStates";

export default function DirectorDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-director", id],
    queryFn: () => apiClient.directors.get(Number(id)),
    enabled: !!id,
  });

  const director = data?.director;
  const movies = data?.movies || [];

  if (isLoading) {
    return (
      <main className="min-h-screen bg-bg-deep flex flex-col">
        <Header />
        <DetailSkeleton tone="primary" />
        <Footer />
      </main>
    );
  }

  if (isError || !director) {
    return (
      <main className="min-h-screen bg-bg-deep flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <Users size={64} className="text-text-muted" />
          <h1 className="text-3xl font-bold text-white">Director not found</h1>
          <Link href="/movies" className="btn-primary px-8 py-3">
            Browse Movies
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg-deep flex flex-col">
      <Header />

      <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <Link
          href="/movies"
          className="inline-flex items-center gap-2 text-sm font-bold text-text-dim hover:text-white transition-colors mb-10"
        >
          <ChevronLeft size={16} />
          All Movies
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start gap-8 mb-16"
        >
          {director.image_url ? (
            <img
              src={director.image_url}
              alt={director.full_name}
              className="w-36 h-36 rounded-full object-cover ring-4 ring-brand-primary/30 shadow-2xl flex-shrink-0"
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 ring-4 ring-white/10">
              <User size={48} className="text-text-dim" />
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-10 bg-brand-primary rounded-full shadow-[0_0_10px_rgba(229,9,20,0.5)]" />
              <h1 className="text-5xl font-outfit font-black text-white uppercase tracking-tight">
                {director.full_name}
              </h1>
            </div>

            <div className="flex flex-wrap gap-6 text-text-dim font-semibold">
              {director.nationality && (
                <span className="glass-panel px-4 py-2 rounded-xl text-sm">
                  🌍 {director.nationality}
                </span>
              )}
              {director.date_of_birth && (
                <span className="glass-panel px-4 py-2 rounded-xl text-sm">
                  Born {new Date(director.date_of_birth).getFullYear()}
                </span>
              )}
            </div>

            {movies.length > 0 && (
              <p className="text-text-dim">
                {movies.length} movie{movies.length !== 1 ? "s" : ""} in collection
              </p>
            )}
          </div>
        </motion.div>

        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-1.5 h-8 bg-brand-primary rounded-full shadow-[0_0_10px_rgba(229,9,20,0.5)]" />
            <h2 className="text-3xl font-outfit font-black text-white uppercase">Filmography</h2>
          </div>
          {movies.length === 0 ? (
            <PublicEmptyState
              icon={emptyIcons.films}
              title="No movies linked yet"
              description="This director exists in the library, but no live movie entries are connected to them yet."
              action={(
                <Link href="/movies" className="btn-secondary px-8 py-3">
                  Browse Movies
                </Link>
              )}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
            >
              {movies.map((movie, i) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <MovieCard movie={movie} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
