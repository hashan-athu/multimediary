"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Play, Info, Calendar, Clock } from "lucide-react";
import { Movie } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface HeroCarouselProps {
  movies: Movie[];
}

export default function HeroCarousel({ movies }: HeroCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (!movies.length) return null;

  return (
    <section className="relative h-[90vh] w-full overflow-hidden">
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {movies.map((movie, index) => (
            <div key={movie.id} className="flex-[0_0_100%] min-w-0 relative h-full">
              <div className="absolute inset-0">
                <img
                  src={movie.poster_url || "/placeholder-hero.jpg"}
                  alt={movie.name}
                  className="w-full h-full object-cover object-top scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-bg-deep via-bg-deep/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-transparent to-transparent" />
              </div>

              <div className="relative h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {selectedIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="max-w-2xl space-y-6"
                    >
                      <div className="flex items-center gap-4 text-brand-secondary font-bold text-sm tracking-widest uppercase">
                        <span className="bg-brand-primary/20 text-brand-primary px-3 py-1 rounded-md border border-brand-primary/20">
                          Featured
                        </span>
                        <span>{movie.category.name}</span>
                      </div>

                      <h1 className="text-6xl md:text-8xl font-outfit font-black text-white leading-[0.9] tracking-tighter">
                        {movie.name.toUpperCase()}
                      </h1>

                      <div className="flex items-center gap-6 text-text-dim font-semibold">
                        {movie.year && (
                          <div className="flex items-center gap-1">
                            <Calendar size={18} className="text-accent" />
                            <span>{movie.year}</span>
                          </div>
                        )}
                        {movie.runtime && (
                          <div className="flex items-center gap-1">
                            <Clock size={18} className="text-accent" />
                            <span>{movie.runtime} min</span>
                          </div>
                        )}
                        {movie.genres.slice(0, 2).map((g) => (
                          <span key={g.id} className="text-text-dim text-sm font-bold uppercase tracking-wider">
                            {g.name}
                          </span>
                        ))}
                      </div>

                      <p className="text-lg text-text-dim leading-relaxed line-clamp-3 max-w-xl">
                        {movie.tagline || "Experience the ultimate cinematic journey with this masterpiece."}
                      </p>

                      <div className="flex items-center gap-4 pt-4">
                        <Tooltip>
                          <TooltipTrigger className="btn-primary py-4 px-10 text-lg flex items-center gap-2">
                            <Play size={20} fill="currentColor" />
                            Watch Trailer
                          </TooltipTrigger>
                          <TooltipContent side="bottom">Coming Soon</TooltipContent>
                        </Tooltip>

                        <Link
                          href={`/movies/${movie.id}`}
                          className="btn-secondary py-4 px-10 text-lg flex items-center gap-2"
                        >
                          <Info size={20} />
                          More Info
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-12 right-12 flex items-center gap-4 z-40">
        <button
          onClick={(e) => { e.stopPropagation(); scrollPrev(); }}
          className="btn-icon w-14 h-14 border-white/10 text-white hover:bg-brand-primary hover:border-brand-primary transition-all shadow-2xl pointer-events-auto"
          aria-label="Previous slide"
        >
          <ChevronLeft size={28} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); scrollNext(); }}
          className="btn-icon w-14 h-14 border-white/10 text-white hover:bg-brand-primary hover:border-brand-primary transition-all shadow-2xl pointer-events-auto"
          aria-label="Next slide"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      {/* Progress Dots */}
      <div className="absolute bottom-12 left-12 flex items-center gap-2 z-40">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={(e) => { e.stopPropagation(); emblaApi?.scrollTo(index); }}
            className={cn(
              "h-1.5 transition-all duration-500 rounded-full cursor-pointer pointer-events-auto",
              selectedIndex === index ? "w-12 bg-brand-primary" : "w-3 bg-white/20 hover:bg-white/40"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
