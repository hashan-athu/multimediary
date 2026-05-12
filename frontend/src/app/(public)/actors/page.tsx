"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Search, User } from "lucide-react";
import { Suspense, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { PeopleGridSkeleton, PublicEmptyState, emptyIcons } from "@/components/PublicStates";

function ActorsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get("page") || "1");
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");
  const debouncedSearch = useDebounce(searchInput, 400);

  const { data, isLoading } = useQuery({
    queryKey: ["public-actors", page, debouncedSearch],
    queryFn: () =>
      apiClient.actors.list({
        page,
        per_page: 24,
        ...(debouncedSearch ? { "q[first_name_or_last_name_cont]": debouncedSearch } : {}),
      }),
  });

  const actors = data?.actors || [];
  const meta = data?.meta;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("q", debouncedSearch);
    params.set("page", String(newPage));
    router.push(`/actors?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-1.5 h-10 bg-brand-secondary rounded-full shadow-[0_0_10px_rgba(0,209,255,0.5)]" />
        <div>
          <h1 className="text-5xl font-outfit font-black text-white uppercase tracking-tight">Actors</h1>
          {meta && <p className="text-text-dim mt-1">{meta.total_count} actors</p>}
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-10 max-w-lg">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
        <input
          type="text"
          placeholder="Search actors..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:bg-white/10 transition-all placeholder:text-text-muted"
        />
      </div>

      {isLoading ? (
        <PeopleGridSkeleton />
      ) : actors.length === 0 ? (
        <PublicEmptyState
          icon={emptyIcons.users}
          title={debouncedSearch ? "No actors found" : "No actors yet"}
          description={
            debouncedSearch
              ? "No live actor data matches this search. Try another name."
              : "Actors will appear here once movies are imported or cast members are added in admin."
          }
        />
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
          >
            {actors.map((actor, i) => (
              <motion.div
                key={actor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  href={`/actors/${actor.id}`}
                  className="group block glass-panel rounded-2xl p-4 text-center hover:border-brand-secondary/30 transition-all hover:-translate-y-1"
                >
                  {actor.image_url ? (
                    <img
                      src={actor.image_url}
                      alt={actor.full_name}
                      className="w-20 h-20 rounded-full object-cover mx-auto mb-3 ring-2 ring-white/10 group-hover:ring-brand-secondary/40 transition-all"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3 ring-2 ring-white/10 group-hover:ring-brand-secondary/40 transition-all">
                      <User size={28} className="text-text-dim" />
                    </div>
                  )}
                  <p className="text-white font-bold text-sm line-clamp-2 group-hover:text-brand-secondary transition-colors">
                    {actor.full_name}
                  </p>
                  {actor.nationality && (
                    <p className="text-text-muted text-[10px] mt-1">{actor.nationality}</p>
                  )}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {meta && meta.total_pages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-16">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="btn-icon w-12 h-12 border-white/10 text-white hover:bg-brand-secondary hover:border-brand-secondary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-text-dim font-semibold">
                Page {page} of {meta.total_pages}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= meta.total_pages}
                className="btn-icon w-12 h-12 border-white/10 text-white hover:bg-brand-secondary hover:border-brand-secondary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ActorsPage() {
  return (
    <main className="min-h-screen bg-bg-deep flex flex-col">
      <Header />
      <Suspense fallback={
        <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
          <PeopleGridSkeleton />
        </div>
      }>
        <ActorsContent />
      </Suspense>
      <Footer />
    </main>
  );
}
