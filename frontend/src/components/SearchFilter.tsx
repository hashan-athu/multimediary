"use client";

import { Search, Filter, ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { MovieParams } from "@/types";

interface SearchFilterProps {
  onFilter: (params: Partial<MovieParams>) => void;
  initialParams?: Partial<MovieParams>;
}

export default function SearchFilter({ onFilter, initialParams = {} }: SearchFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [query, setQuery] = useState(initialParams["q[name_cont]"] || "");
  const [genreId, setGenreId] = useState(initialParams["q[genres_id_eq]"] || "");
  const [categoryId, setCategoryId] = useState(initialParams["q[category_id_eq]"] || "");
  const [year, setYear] = useState(initialParams["q[year_eq]"] || "");

  const { data: genreData } = useQuery({
    queryKey: ["public-genres"],
    queryFn: () => apiClient.genres.list(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: categoryData } = useQuery({
    queryKey: ["public-categories"],
    queryFn: () => apiClient.categories.list(),
    staleTime: 5 * 60 * 1000,
  });

  const genres = genreData?.genres || [];
  const categories = categoryData?.categories || [];

  const buildParams = (q: string, gId: string, cId: string, yr: string): Partial<MovieParams> => {
    const params: Partial<MovieParams> = {};
    if (q) params["q[name_cont]"] = q;
    if (gId) params["q[genres_id_eq]"] = gId;
    if (cId) params["q[category_id_eq]"] = cId;
    if (yr) params["q[year_eq]"] = yr;
    return params;
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    onFilter(buildParams(val, genreId, categoryId, year));
  };

  const handleApply = () => {
    onFilter(buildParams(query, genreId, categoryId, year));
    setIsFilterOpen(false);
  };

  const handleReset = () => {
    setQuery("");
    setGenreId("");
    setCategoryId("");
    setYear("");
    onFilter({});
    setIsFilterOpen(false);
  };

  const activeFilterCount = [genreId, categoryId, year].filter(Boolean).length;

  return (
    <div className="w-full max-w-5xl mx-auto px-5 md:px-6 mb-12">
      <div className="relative group">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center md:gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand-secondary transition-colors md:left-5"
              size={21}
            />
            <input
              type="text"
              placeholder="Search movies..."
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.06] pl-12 pr-4 text-base outline-none transition-all placeholder:text-text-muted focus:bg-white/10 focus:ring-2 focus:ring-brand-secondary/30 md:h-16 md:pl-14 md:pr-6 md:text-lg"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(
              "btn-secondary relative h-14 w-full justify-center gap-3 px-6 py-0 sm:w-auto md:h-16 md:px-8",
              isFilterOpen && "bg-white/10 border-brand-secondary/50 text-brand-secondary"
            )}
          >
            <Filter size={20} />
            <span className="font-bold">Filters</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-brand-primary rounded-full text-[10px] font-black flex items-center justify-center text-white">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown size={18} className={cn("transition-transform", isFilterOpen && "rotate-180")} />
          </button>
        </div>

        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 z-30 mt-4 grid grid-cols-1 gap-5 rounded-3xl p-5 shadow-2xl glass-panel md:grid-cols-4 md:gap-8 md:p-8"
            >
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-text-dim">Genre</label>
                <select
                  value={genreId}
                  onChange={(e) => setGenreId(e.target.value)}
                  className="input-cinematic w-full appearance-none cursor-pointer"
                >
                  <option value="">All Genres</option>
                  {genres.map((g) => (
                    <option key={g.id} value={String(g.id)}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-text-dim">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="input-cinematic w-full appearance-none cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={String(c.id)}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-text-dim">Year</label>
                <input
                  type="number"
                  placeholder="e.g. 2024"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  min="1900"
                  max="2030"
                  className="input-cinematic w-full"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-text-dim">Sort</label>
                <select className="input-cinematic w-full appearance-none cursor-pointer" disabled>
                  <option>Newest First</option>
                </select>
              </div>

              <div className="flex flex-col gap-3 border-t border-white/5 pt-4 md:col-span-4 md:flex-row md:justify-end md:gap-4">
                <button
                  onClick={handleReset}
                  className="rounded-full px-6 py-3 font-bold text-text-dim transition-colors hover:text-white"
                >
                  Reset
                </button>
                <button onClick={handleApply} className="btn-primary px-10 py-3">
                  Apply Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
