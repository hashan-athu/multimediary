"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import { motion } from "framer-motion";
import { ChevronLeft, User, Users } from "lucide-react";
import Link from "next/link";

export default function ActorDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-actor", id],
    queryFn: () => apiClient.actors.get(Number(id)),
    enabled: !!id,
  });

  const actor = data?.actor;
  const movies = data?.movies || [];

  if (isLoading) {
    return (
      <main className="min-h-screen bg-bg-deep flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-brand-secondary border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </main>
    );
  }

  if (isError || !actor) {
    return (
      <main className="min-h-screen bg-bg-deep flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <Users size={64} className="text-text-muted" />
          <h1 className="text-3xl font-bold text-white">Actor not found</h1>
          <Link href="/actors" className="btn-primary px-8 py-3">
            All Actors
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg-deep flex flex-col">
      <Header />

      <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <Link
          href="/actors"
          className="inline-flex items-center gap-2 text-sm font-bold text-text-dim hover:text-white transition-colors mb-10"
        >
          <ChevronLeft size={16} />
          All Actors
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start gap-8 mb-16"
        >
          {actor.image_url ? (
            <img
              src={actor.image_url}
              alt={actor.full_name}
              className="w-36 h-36 rounded-full object-cover ring-4 ring-brand-secondary/30 shadow-2xl flex-shrink-0"
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 ring-4 ring-white/10">
              <User size={48} className="text-text-dim" />
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-10 bg-brand-secondary rounded-full shadow-[0_0_10px_rgba(0,209,255,0.5)]" />
              <h1 className="text-5xl font-outfit font-black text-white uppercase tracking-tight">
                {actor.full_name}
              </h1>
            </div>

            <div className="flex flex-wrap gap-6 text-text-dim font-semibold">
              {actor.nationality && (
                <span className="glass-panel px-4 py-2 rounded-xl text-sm">
                  🌍 {actor.nationality}
                </span>
              )}
              {actor.gender && (
                <span className="glass-panel px-4 py-2 rounded-xl text-sm capitalize">
                  {actor.gender}
                </span>
              )}
              {actor.date_of_birth && (
                <span className="glass-panel px-4 py-2 rounded-xl text-sm">
                  Born {new Date(actor.date_of_birth).getFullYear()}
                </span>
              )}
            </div>

            {movies.length > 0 && (
              <p className="text-text-dim">
                {movies.length} movie{movies.length !== 1 ? "s" : ""} in collection
              </p>
            )}
          </div>
        </motion.div>

        {movies.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-1.5 h-8 bg-brand-primary rounded-full shadow-[0_0_10px_rgba(229,9,20,0.5)]" />
              <h2 className="text-3xl font-outfit font-black text-white uppercase">Filmography</h2>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
            >
              {movies.map((movie, i) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <MovieCard movie={movie} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
