"use client";

import { Movie } from "@/types";
import { Play, Plus, Star } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

export default function MovieCard({ movie, className }: MovieCardProps) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className={cn(
        "group relative aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer shadow-xl",
        className
      )}
    >
      <img
        src={movie.poster_url || "/placeholder-poster.jpg"}
        alt={movie.name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-4">
        <div className="flex justify-end gap-2">
          <button className="btn-icon w-8 h-8 bg-white/10 hover:bg-brand-primary border-none">
            <Plus size={16} />
          </button>
        </div>

        <div className="space-y-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center gap-2">
            <div className="bg-accent text-black text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <Star size={10} fill="currentColor" />
              8.4
            </div>
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">
              {movie.category.name}
            </span>
          </div>

          <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">
            {movie.name}
          </h3>

          <div className="flex flex-wrap gap-1">
            {movie.genres.slice(0, 2).map((genre) => (
              <span key={genre.id} className="text-[9px] text-text-dim uppercase font-bold">
                {genre.name}
              </span>
            ))}
          </div>

          <button className="w-full btn-primary py-2 text-xs">
            <Play size={14} fill="currentColor" />
            Watch Now
          </button>
        </div>
      </div>

      {/* Basic info always visible if desired, or just use the hover overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 movie-card-gradient pointer-events-none group-hover:opacity-0 transition-opacity">
        <h3 className="text-white font-bold text-sm truncate">{movie.name}</h3>
        <p className="text-text-dim text-[10px] font-bold">{movie.year} • {movie.category.name}</p>
      </div>
    </motion.div>
  );
}
