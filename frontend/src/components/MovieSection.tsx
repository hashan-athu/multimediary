"use client";

import { Movie } from "@/types";
import MovieCard from "./MovieCard";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { PublicEmptyState, emptyIcons } from "@/components/PublicStates";

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  viewAllHref?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}

export default function MovieSection({
  title,
  movies,
  viewAllHref,
  emptyTitle = "No movies available",
  emptyDescription = "There is no live movie data for this section yet. Add movies in the admin area to fill this space.",
}: MovieSectionProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-8 bg-brand-primary rounded-full shadow-[0_0_10px_rgba(229,9,20,0.5)]" />
          <h2 className="text-3xl font-outfit font-black tracking-tight text-white">
            {title.toUpperCase()}
          </h2>
        </div>
        
        {viewAllHref && (
          <Link 
            href={viewAllHref} 
            className="flex items-center gap-2 text-sm font-bold text-text-dim hover:text-brand-secondary transition-colors group"
          >
            VIEW ALL
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>

      {!movies.length && (
        <PublicEmptyState
          icon={emptyIcons.films}
          title={emptyTitle}
          description={emptyDescription}
          action={viewAllHref ? (
            <Link href={viewAllHref} className="btn-secondary px-8 py-3">
              Browse Movies
            </Link>
          ) : undefined}
        />
      )}

      {movies.length > 0 && (
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6"
      >
        {movies.map((movie) => (
          <motion.div key={movie.id} variants={item}>
            <MovieCard movie={movie} />
          </motion.div>
        ))}
      </motion.div>
      )}
    </div>
  );
}
