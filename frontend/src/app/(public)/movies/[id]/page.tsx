"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
  Play, Calendar, Clock, Globe, Star,
  ChevronLeft, User, Film,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-movie", id],
    queryFn: () => apiClient.movies.get(Number(id)),
    enabled: !!id,
  });

  const movie = data?.movie;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-bg-deep flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(229,9,20,0.4)]" />
            <p className="text-brand-secondary font-bold tracking-[0.2em] animate-pulse">LOADING...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (isError || !movie) {
    return (
      <main className="min-h-screen bg-bg-deep flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <Film size={64} className="text-text-muted" />
          <h1 className="text-3xl font-bold text-white">Movie not found</h1>
          <Link href="/movies" className="btn-primary px-8 py-3">
            Back to Movies
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const averageRating =
    movie.ratings?.length
      ? movie.ratings.reduce((sum, r) => sum + (r.rating_value / r.rating_out_of) * 10, 0) / movie.ratings.length
      : null;

  return (
    <main className="min-h-screen bg-bg-deep flex flex-col">
      <Header />

      {/* Hero backdrop */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        {movie.poster_url ? (
          <img
            src={movie.poster_url}
            alt={movie.name}
            className="w-full h-full object-cover object-top scale-105"
          />
        ) : (
          <div className="w-full h-full bg-bg-surface" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-bg-deep via-bg-deep/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-transparent to-bg-deep/20" />
      </div>

      {/* Content panel */}
      <div className="relative -mt-48 z-10 max-w-7xl mx-auto px-6 md:px-12 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10"
        >
          {/* Poster */}
          <div className="hidden md:block">
            <div className="aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              {movie.poster_url ? (
                <img
                  src={movie.poster_url}
                  alt={movie.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-bg-surface flex items-center justify-center">
                  <Film size={48} className="text-text-muted" />
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-8 pt-16 md:pt-0 md:self-end">
            {/* Back link */}
            <Link
              href="/movies"
              className="inline-flex items-center gap-2 text-sm font-bold text-text-dim hover:text-white transition-colors"
            >
              <ChevronLeft size={16} />
              All Movies
            </Link>

            {/* Category badge */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="bg-brand-primary/20 text-brand-primary px-3 py-1 rounded-md border border-brand-primary/20 text-sm font-bold">
                {movie.category.name}
              </span>
              {movie.genres.map((g) => (
                <span key={g.id} className="text-xs font-bold text-text-dim uppercase tracking-wider border border-white/10 px-2 py-1 rounded-md">
                  {g.name}
                </span>
              ))}
            </div>

            <h1 className="text-5xl md:text-7xl font-outfit font-black text-white leading-[0.9] tracking-tighter">
              {movie.name.toUpperCase()}
            </h1>

            {movie.tagline && (
              <p className="text-xl text-text-dim italic">"{movie.tagline}"</p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-6 text-text-dim font-semibold">
              {movie.year && (
                <div className="flex items-center gap-1.5">
                  <Calendar size={18} className="text-accent" />
                  <span>{movie.year}</span>
                </div>
              )}
              {movie.runtime && (
                <div className="flex items-center gap-1.5">
                  <Clock size={18} className="text-accent" />
                  <span>{movie.runtime} min</span>
                </div>
              )}
              {movie.language && (
                <div className="flex items-center gap-1.5">
                  <Globe size={18} className="text-accent" />
                  <span>{movie.language}</span>
                </div>
              )}
              {averageRating !== null && (
                <div className="flex items-center gap-1.5">
                  <Star size={18} className="text-accent fill-accent" />
                  <span>{averageRating.toFixed(1)} / 10</span>
                </div>
              )}
            </div>

            {/* CTA buttons */}
            <div className="flex items-center gap-4 pt-2">
              <Tooltip>
                <TooltipTrigger className="btn-primary py-4 px-10 text-lg flex items-center gap-2">
                  <Play size={20} fill="currentColor" />
                  Watch Now
                </TooltipTrigger>
                <TooltipContent side="bottom">Coming Soon</TooltipContent>
              </Tooltip>
            </div>

            {/* Description */}
            {(movie.description || movie.story) && (
              <div className="space-y-4 pt-2">
                {movie.description && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-text-dim mb-2">Overview</h3>
                    <p className="text-text-dim leading-relaxed">{movie.description}</p>
                  </div>
                )}
                {movie.story && movie.story !== movie.description && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-text-dim mb-2">Story</h3>
                    <p className="text-text-dim leading-relaxed">{movie.story}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Director & Cast */}
        {(movie.director || movie.actors?.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 space-y-12"
          >
            {movie.director && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-1.5 h-8 bg-brand-primary rounded-full shadow-[0_0_10px_rgba(229,9,20,0.5)]" />
                  <h2 className="text-2xl font-outfit font-black text-white uppercase">Director</h2>
                </div>
                <div className="flex items-center gap-4 glass-panel rounded-2xl p-4 w-fit">
                  {movie.director.image_url ? (
                    <img
                      src={movie.director.image_url}
                      alt={movie.director.full_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                      <User size={28} className="text-text-dim" />
                    </div>
                  )}
                  <div>
                    <p className="text-white font-bold text-lg">{movie.director.full_name}</p>
                    {movie.director.nationality && (
                      <p className="text-text-dim text-sm">{movie.director.nationality}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {movie.actors?.length > 0 && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-1.5 h-8 bg-brand-secondary rounded-full shadow-[0_0_10px_rgba(0,209,255,0.5)]" />
                  <h2 className="text-2xl font-outfit font-black text-white uppercase">Cast</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {movie.actors.map((actor) => (
                    <Link
                      key={actor.id}
                      href={`/actors/${actor.id}`}
                      className="group glass-panel rounded-2xl p-4 text-center hover:border-brand-secondary/30 transition-all"
                    >
                      {actor.image_url ? (
                        <img
                          src={actor.image_url}
                          alt={actor.full_name}
                          className="w-16 h-16 rounded-full object-cover mx-auto mb-3"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
                          <User size={24} className="text-text-dim" />
                        </div>
                      )}
                      <p className="text-white font-bold text-sm line-clamp-2 group-hover:text-brand-secondary transition-colors">
                        {actor.full_name}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Ratings */}
        {movie.ratings?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-1.5 h-8 bg-accent rounded-full shadow-[0_0_10px_rgba(245,189,50,0.5)]" />
              <h2 className="text-2xl font-outfit font-black text-white uppercase">Ratings</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {movie.ratings.map((rating) => (
                <div key={rating.id} className="glass-panel rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-white">{rating.reviewer.name}</p>
                    {rating.reviewer.website_url && (
                      <a
                        href={rating.reviewer.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-text-dim hover:text-brand-secondary transition-colors"
                      >
                        Visit ↗
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Star size={18} className="text-accent fill-accent" />
                    <span className="text-2xl font-black text-white">
                      {rating.rating_value}
                    </span>
                    <span className="text-text-dim font-semibold">/ {rating.rating_out_of}</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-accent transition-all"
                      style={{ width: `${(rating.rating_value / rating.rating_out_of) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Disk / format info */}
        {movie.disk && (
          <div className="mt-16 glass-panel rounded-2xl p-6 flex flex-wrap gap-8">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-text-dim mb-1">Disk</p>
              <p className="text-white font-semibold">{movie.disk.name}</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-text-dim mb-1">Storage</p>
              <p className="text-white font-semibold">{movie.disk.storage_type}</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-text-dim mb-1">Format</p>
              <p className="text-white font-semibold">{movie.disk.format}</p>
            </div>
            {movie.file_size && (
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-text-dim mb-1">File Size</p>
                <p className="text-white font-semibold">{movie.file_size} GB</p>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
