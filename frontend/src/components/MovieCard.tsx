"use client";

import { Movie } from "@/types";
import { Play, Star } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

export default function MovieCard({ movie, className }: MovieCardProps) {
  const router = useRouter();

  return (
    <motion.div
      whileHover={{ y: -10 }}
      onClick={() => router.push(`/movies/${movie.id}`)}
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

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-4">
        <div />

        <div className="space-y-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center gap-2">
            <div className="bg-accent text-black text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <Star size={10} fill="currentColor" />
              HD
            </div>
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">
              {movie.category.name}
            </span>
          </div>

          <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">
            {movie.name}
          </h3>

          <div className="flex flex-wrap gap-1">
            {movie.genres.slice(0, 2).map((genre: { id: number; name: string }) => (
              <span key={genre.id} className="text-[9px] text-text-dim uppercase font-bold">
                {genre.name}
              </span>
            ))}
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            <Tooltip>
              <TooltipTrigger className="w-full btn-primary py-2 text-xs flex items-center justify-center gap-1">
                <Play size={14} fill="currentColor" />
                Watch Now
              </TooltipTrigger>
              <TooltipContent side="top">Coming Soon</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Always-visible label */}
      <div className="absolute bottom-0 left-0 right-0 p-4 movie-card-gradient pointer-events-none group-hover:opacity-0 transition-opacity">
        <h3 className="text-white font-bold text-sm truncate">{movie.name}</h3>
        <p className="text-text-dim text-[10px] font-bold">{movie.year} • {movie.category.name}</p>
      </div>
    </motion.div>
  );
}
