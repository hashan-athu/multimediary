"use client";

import { Movie } from "@/types";
import { Play } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import Image from "next/image";

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
      className={cn("group cursor-pointer relative", className)}
    >
      <div className="relative aspect-2/3 overflow-hidden ">
        <Image
          src={movie.poster_url || "/placeholder-poster.jpg"}
          alt={movie.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          width={300}
          height={450}
          loading="lazy"
        />

        {/* Hover overlay */}
        <div className="hidden absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 md:flex flex-col justify-between p-4">
          <div />

          <div className="space-y-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex flex-wrap gap-1">
              {movie.genres
                .slice(0, 2)
                .map((genre: { id: number; name: string }) => (
                  <Link
                    key={genre.id}
                    href={`/movies?genre_id=${genre.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-text-dim backdrop-blur-md hover:border-white/30 hover:text-white transition-colors"
                  >
                    {genre.name}
                  </Link>
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
      </div>

      {/* Always-visible label */}
      <div className="pt-3">
        <h3 className="text-white group-hover:text-brand-primary transition-colors font-semibold leading-tight line-clamp-3">
          {movie.name}
        </h3>
        <p className="text-text-dim text-xs font-semibold mt-1 flex items-center gap-1 flex-wrap">
          {movie.year && (
            <Link
              href={`/movies?year=${movie.year}`}
              onClick={(e) => e.stopPropagation()}
              className="hover:text-accent transition-colors"
            >
              {movie.year}
            </Link>
          )}
          {movie.year && <span>•</span>}
          <Link
            href={`/movies?category_id=${movie.category.id}`}
            onClick={(e) => e.stopPropagation()}
            className="hover:text-brand-secondary transition-colors"
          >
            {movie.category.name}
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
