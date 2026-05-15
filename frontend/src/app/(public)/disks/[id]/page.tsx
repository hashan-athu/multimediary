"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import { motion } from "framer-motion";
import { ChevronLeft, HardDrive } from "lucide-react";
import Link from "next/link";
import { DetailSkeleton, PublicEmptyState, emptyIcons } from "@/components/PublicStates";

export default function DiskDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-disk", id],
    queryFn: () => apiClient.disks.get(Number(id)),
    enabled: !!id,
  });

  const disk = data?.disk;
  const movies = data?.movies || [];

  if (isLoading) {
    return (
      <main className="min-h-screen bg-bg-deep flex flex-col">
        <Header />
        <DetailSkeleton tone="secondary" />
        <Footer />
      </main>
    );
  }

  if (isError || !disk) {
    return (
      <main className="min-h-screen bg-bg-deep flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <HardDrive size={64} className="text-text-muted" />
          <h1 className="text-3xl font-bold text-white">Disk not found</h1>
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
          <div className="w-36 h-36 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
            <HardDrive size={56} className="text-brand-secondary" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-10 bg-brand-secondary rounded-full shadow-[0_0_10px_rgba(0,209,255,0.5)]" />
              <h1 className="text-5xl font-outfit font-black text-white uppercase tracking-tight">
                {disk.name}
              </h1>
            </div>

            <div className="flex flex-wrap gap-4 text-text-dim font-semibold">
              <span className="glass-panel px-4 py-2 rounded-xl text-sm">
                {disk.storage_type}
              </span>
              {disk.disk_format && (
                <span className="glass-panel px-4 py-2 rounded-xl text-sm">
                  {disk.disk_format.name}
                </span>
              )}
            </div>

            <p className="text-text-dim">
              {movies.length} movie{movies.length !== 1 ? "s" : ""} on this disk
            </p>
          </div>
        </motion.div>

        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-1.5 h-8 bg-brand-secondary rounded-full shadow-[0_0_10px_rgba(0,209,255,0.5)]" />
            <h2 className="text-3xl font-outfit font-black text-white uppercase">Movies on this Disk</h2>
          </div>
          {movies.length === 0 ? (
            <PublicEmptyState
              icon={emptyIcons.films}
              title="No movies on this disk"
              description="This disk exists in the library but has no movies linked to it yet."
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
