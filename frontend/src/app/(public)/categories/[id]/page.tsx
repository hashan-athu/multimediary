"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import { motion } from "framer-motion";
import { ChevronLeft, Layers } from "lucide-react";
import Link from "next/link";
import { DetailSkeleton, PublicEmptyState, emptyIcons } from "@/components/PublicStates";

export default function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-category", id],
    queryFn: () => apiClient.categories.get(Number(id)),
    enabled: !!id,
  });

  const category = data?.category;
  const movies = data?.movies || [];

  if (isLoading) {
    return (
      <main className="min-h-screen bg-bg-deep flex flex-col">
        <Header />
        <DetailSkeleton />
        <Footer />
      </main>
    );
  }

  if (isError || !category) {
    return (
      <main className="min-h-screen bg-bg-deep flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 py-32">
          <Layers size={64} className="text-text-muted" />
          <h1 className="text-3xl font-bold text-white">Category not found</h1>
          <Link href="/categories" className="btn-primary px-8 py-3">
            All Categories
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
          href="/categories"
          className="inline-flex items-center gap-2 text-sm font-bold text-text-dim hover:text-white transition-colors mb-8"
        >
          <ChevronLeft size={16} />
          All Categories
        </Link>

        <div className="flex items-center gap-4 mb-12">
          <div className="w-1.5 h-10 bg-brand-primary rounded-full shadow-[0_0_10px_rgba(229,9,20,0.5)]" />
          <div>
            <h1 className="text-5xl font-outfit font-black text-white uppercase tracking-tight">
              {category.name}
            </h1>
            <p className="text-text-dim mt-1">{category.movie_count} movies</p>
          </div>
        </div>

        {movies.length === 0 ? (
          <PublicEmptyState
            icon={emptyIcons.films}
            title="No movies in this category"
            description="This category exists, but it does not have any live movie data attached yet."
            action={(
              <Link href="/movies" className="btn-secondary px-8 py-3">
                Browse All Movies
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
      <Footer />
    </main>
  );
}
