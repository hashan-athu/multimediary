"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Info,
  Calendar,
  Clock,
  Sparkles,
} from "lucide-react";
import { Movie } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { PublicEmptyState, emptyIcons } from "@/components/PublicStates";
import Image from "next/image";

interface HeroCarouselProps {
  movies: Movie[];
}

export default function HeroCarousel({ movies }: HeroCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [trailerTooltipOpen, setTrailerTooltipOpen] = useState(false);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    const frame = requestAnimationFrame(onSelect);
    return () => {
      cancelAnimationFrame(frame);
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || movies.length <= 1) return;
    const timer = window.setInterval(() => emblaApi.scrollNext(), 5000);
    return () => window.clearInterval(timer);
  }, [emblaApi, movies.length]);

  if (!movies.length) {
    return (
      <section className="relative min-h-[70vh] w-full flex items-center bg-bg-surface overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-brand-primary/10 via-bg-deep to-brand-secondary/10" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
          <PublicEmptyState
            icon={emptyIcons.films}
            title="No featured movies yet"
            description="This is a fresh library with no live movie data. Imported or manually added movies will appear here automatically."
            action={
              <Link href="/movies" className="btn-primary px-8 py-3">
                Browse Library
              </Link>
            }
          />
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full max-w-full overflow-hidden bg-bg-deep">
      <div
        className="h-[82svh] min-h-160 w-full max-w-full overflow-hidden md:h-[74svh] md:min-h-170 lg:h-[76vh] lg:min-h-155 xl:h-[80vh]"
        ref={emblaRef}
      >
        <div className="flex h-full">
          {movies.map((movie, index) => (
            <div
              key={movie.id}
              className="relative h-full min-w-0 flex-[0_0_100%] overflow-hidden"
            >
              <div className="absolute inset-0">
                <Image
                  src={
                    movie.backdrop_url ||
                    movie.poster_url ||
                    "/assets/images/placeholders/hero-carousel-placeholder.webp"
                  }
                  alt={movie.name}
                  className="w-full h-full object-cover object-center scale-105"
                  fetchPriority={index === 0 ? "high" : "low"} // Prioritize loading the first image
                  width={1920}
                  height={1080}
                />
                <div className="absolute inset-0 bg-linear-to-r from-bg-deep via-bg-deep/55 to-transparent" />
                <div className="absolute inset-0 bg-linear-to-t from-bg-deep via-bg-deep/20 to-transparent" />
                <div className="absolute inset-0 bg-linear-to-b from-bg-deep/75 via-transparent to-bg-deep/20 md:from-bg-deep/25" />
              </div>

              <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-12 pt-28 md:justify-center md:px-10 md:pb-0 md:pt-24 lg:px-12 lg:pt-20 xl:pt-16">
                <AnimatePresence mode="wait">
                  {selectedIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="max-w-2xl space-y-5 md:max-w-4xl md:space-y-6 lg:max-w-5xl xl:max-w-4xl"
                    >
                      <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-black uppercase tracking-[0.18em] md:gap-4 md:text-sm">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-primary/30 bg-brand-primary/15 px-3 py-1.5 text-brand-primary shadow-[0_0_24px_rgba(229,9,20,0.18)] backdrop-blur-md md:rounded-md md:py-1">
                          <Sparkles size={12} />
                          Featured
                        </span>
                        <span className="rounded-full border border-brand-secondary/20 bg-brand-secondary/10 px-3 py-1.5 text-brand-secondary backdrop-blur-md md:border-0 md:bg-transparent md:px-0 md:py-0">
                          {movie.category.name}
                        </span>
                      </div>

                      <p className="text-[clamp(2.45rem,12vw,4.2rem)] font-bold leading-[0.95] text-white md:text-[clamp(4.5rem,9vw,7.75rem)] md:leading-[0.9] lg:text-[clamp(4.5rem,7vw,7.25rem)] xl:text-[clamp(5rem,6.2vw,8rem)]">
                        {movie.name.toUpperCase()}
                      </p>

                      <div className="flex flex-wrap items-center gap-2.5 text-sm font-bold text-text-dim md:gap-6 md:text-base">
                        {movie.year && (
                          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 backdrop-blur-md md:border-0 md:bg-transparent md:px-0 md:py-0">
                            <Calendar size={16} className="text-accent md:size-[18px]" />
                            <span>{movie.year}</span>
                          </div>
                        )}
                        {movie.runtime && (
                          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 backdrop-blur-md md:border-0 md:bg-transparent md:px-0 md:py-0">
                            <Clock size={16} className="text-accent md:size-[18px]" />
                            <span>{movie.runtime} min</span>
                          </div>
                        )}
                        {movie.genres.slice(0, 2).map((g) => (
                          <span
                            key={g.id}
                            className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-text-dim backdrop-blur-md md:border-0 md:bg-transparent md:px-0 md:py-0 md:text-sm"
                          >
                            {g.name}
                          </span>
                        ))}
                      </div>

                      <p className="max-w-xl text-base leading-relaxed text-text-dim line-clamp-2 md:text-lg md:line-clamp-3">
                        {movie.tagline ||
                          "Experience the ultimate cinematic journey with this masterpiece."}
                      </p>

                      <div className="flex flex-col items-start gap-3 pt-2 sm:flex-row md:gap-4 md:pt-4">
                        <Tooltip
                          open={trailerTooltipOpen && selectedIndex === index}
                          onOpenChange={setTrailerTooltipOpen}
                        >
                          <TooltipTrigger
                            type="button"
                            onClick={() => setTrailerTooltipOpen(true)}
                            className="btn-primary w-full min-w-60 py-4 px-8 text-base sm:w-auto md:px-10 md:text-lg"
                          >
                            <Play size={20} fill="currentColor" />
                            Watch Trailer
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            Coming Soon
                          </TooltipContent>
                        </Tooltip>

                        <Link
                          href={`/movies/${movie.id}`}
                          className="btn-secondary w-full min-w-52 py-4 px-8 text-base sm:w-auto md:px-10 md:text-lg"
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
      <div className="relative z-40 mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-10 lg:px-12">
        <div className="flex items-center gap-2">
          {movies.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                emblaApi?.scrollTo(index);
              }}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                selectedIndex === index
                  ? "w-12 bg-brand-primary"
                  : "w-3 bg-white/25 hover:bg-white/45",
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              scrollPrev();
            }}
            className="btn-icon h-12 w-12 border-white/10 text-white shadow-2xl transition-all hover:border-brand-primary hover:bg-brand-primary md:h-14 md:w-14"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} className="md:size-7" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              scrollNext();
            }}
            className="btn-icon h-12 w-12 border-white/10 text-white shadow-2xl transition-all hover:border-brand-primary hover:bg-brand-primary md:h-14 md:w-14"
            aria-label="Next slide"
          >
            <ChevronRight size={24} className="md:size-7" />
          </button>
        </div>
      </div>
    </section>
  );
}
