"use client";

import { Movie } from "@/types";
import MovieCard from "./MovieCard";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  viewAllHref?: string;
}

export default function MovieSection({ title, movies, viewAllHref }: MovieSectionProps) {
  if (!movies.length) return null;

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
      <div className="flex items-center justify-between">
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

      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
      >
        {movies.map((movie) => (
          <motion.div key={movie.id} variants={item}>
            <MovieCard movie={movie} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
