"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { MovieParams } from "@/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchFilter from "@/components/SearchFilter";
import MovieCard from "@/components/MovieCard";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Suspense } from "react";
import { MovieGridSkeleton, PublicEmptyState, emptyIcons } from "@/components/PublicStates";

function MoviesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") || "1");
  const q = searchParams.get("q") || "";
  const genreId = searchParams.get("genre_id") || "";
  const categoryId = searchParams.get("category_id") || "";
  const year = searchParams.get("year") || "";

  const buildQueryParams = (): MovieParams => {
    const params: MovieParams = { page, per_page: 24 };
    if (q) params["q[name_cont]"] = q;
    if (genreId) params["q[genres_id_eq]"] = genreId;
    if (categoryId) params["q[category_id_eq]"] = categoryId;
    if (year) params["q[year_eq]"] = year;
    return params;
  };

  const initialFilterParams: Partial<MovieParams> = {};
  if (q) initialFilterParams["q[name_cont]"] = q;
  if (genreId) initialFilterParams["q[genres_id_eq]"] = genreId;
  if (categoryId) initialFilterParams["q[category_id_eq]"] = categoryId;
  if (year) initialFilterParams["q[year_eq]"] = year;

  const { data, isLoading } = useQuery({
    queryKey: ["public-movies-listing", page, q, genreId, categoryId, year],
    queryFn: () => apiClient.movies.list(buildQueryParams()),
  });

  const movies = data?.movies || [];
  const meta = data?.meta;

  const pushParams = (overrides: Record<string, string>) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (genreId) params.set("genre_id", genreId);
    if (categoryId) params.set("category_id", categoryId);
    if (year) params.set("year", year);
    params.set("page", "1");
    Object.entries(overrides).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    router.push(`/movies?${params.toString()}`);
  };

  const handleFilter = (params: Partial<MovieParams>) => {
    const newParams = new URLSearchParams();
    if (params["q[name_cont]"]) newParams.set("q", params["q[name_cont]"]!);
    if (params["q[genres_id_eq]"]) newParams.set("genre_id", params["q[genres_id_eq]"]!);
    if (params["q[category_id_eq]"]) newParams.set("category_id", params["q[category_id_eq]"]!);
    if (params["q[year_eq]"]) newParams.set("year", params["q[year_eq]"]!);
    router.push(`/movies?${newParams.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    pushParams({ page: String(newPage) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="pt-28 pb-8 px-6 md:px-12 max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-outfit font-black text-white uppercase tracking-tight mb-2">
          All Movies
        </h1>
        {meta && (
          <p className="text-text-dim font-semibold">
            {meta.total_count} title{meta.total_count !== 1 ? "s" : ""} found
          </p>
        )}
      </div>

      <SearchFilter onFilter={handleFilter} initialParams={initialFilterParams} />

      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
        {isLoading ? (
          <MovieGridSkeleton />
        ) : movies.length === 0 ? (
          <PublicEmptyState
            icon={emptyIcons.search}
            title="No movies found"
            description="No live movie data matches the current filters. Try adjusting your search, or add movies from the admin area."
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

        {/* Pagination */}
        {meta && meta.total_pages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-16">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className="btn-icon w-12 h-12 border-white/10 text-white hover:bg-brand-primary hover:border-brand-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: meta.total_pages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === meta.total_pages || Math.abs(p - page) <= 2)
                .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === "..." ? (
                    <span key={`ellipsis-${idx}`} className="text-text-muted px-2">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p as number)}
                      className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                        page === p
                          ? "bg-brand-primary text-white shadow-[0_0_15px_rgba(229,9,20,0.4)]"
                          : "text-text-dim hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
            </div>

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= meta.total_pages}
              className="btn-icon w-12 h-12 border-white/10 text-white hover:bg-brand-primary hover:border-brand-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default function MoviesPage() {
  return (
    <main className="min-h-screen bg-bg-deep flex flex-col">
      <Header />
      <Suspense fallback={
        <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
          <MovieGridSkeleton />
        </div>
      }>
        <MoviesContent />
      </Suspense>
      <Footer />
    </main>
  );
}
