"use client";

import { Search, Filter, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SearchFilterProps {
  onSearch: (query: string) => void;
}

export default function SearchFilter({ onSearch }: SearchFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    onSearch(val); // Instant search for better feedback
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 mb-12">
      <div className="relative group">
        <form onSubmit={handleSearch} className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search 
              className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand-secondary transition-colors" 
              size={22} 
            />
            <input
              type="text"
              placeholder="Search movies, actors, or genres..."
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-lg outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:bg-white/10 transition-all placeholder:text-text-muted"
            />
          </div>
          
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(
              "btn-secondary py-5 px-8 flex items-center gap-3",
              isFilterOpen && "bg-white/10 border-brand-secondary/50 text-brand-secondary"
            )}
          >
            <Filter size={20} />
            <span className="font-bold">Filters</span>
            <ChevronDown size={18} className={cn("transition-transform", isFilterOpen && "rotate-180")} />
          </button>
        </form>

        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-4 p-8 glass-panel rounded-3xl z-30 grid grid-cols-1 md:grid-cols-4 gap-8 shadow-2xl"
            >
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-text-dim">Genre</label>
                <select className="input-cinematic w-full appearance-none cursor-pointer">
                  <option value="">All Genres</option>
                  <option>Action</option>
                  <option>Crime</option>
                  <option>Thriller</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-text-dim">Category</label>
                <select className="input-cinematic w-full appearance-none cursor-pointer">
                  <option value="">All Categories</option>
                  <option>Hollywood</option>
                  <option>International</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-text-dim">Year</label>
                <input type="number" placeholder="e.g. 2024" className="input-cinematic w-full" />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-text-dim">Quality</label>
                <select className="input-cinematic w-full appearance-none cursor-pointer">
                  <option value="">Any Quality</option>
                  <option>4K UHD</option>
                  <option>1080p Bluray</option>
                </select>
              </div>

              <div className="md:col-span-4 flex justify-end gap-4 pt-4 border-t border-white/5">
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="px-6 py-3 font-bold text-text-dim hover:text-white transition-colors"
                >
                  Reset
                </button>
                <button className="btn-primary px-10 py-3">
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
