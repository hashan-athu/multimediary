"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { Film, Layers } from "lucide-react";

export default function CategoriesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["public-categories"],
    queryFn: () => apiClient.categories.list(),
  });

  const categories = data?.categories || [];

  return (
    <main className="min-h-screen bg-bg-deep flex flex-col">
      <Header />

      <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-1.5 h-10 bg-brand-primary rounded-full shadow-[0_0_10px_rgba(229,9,20,0.5)]" />
          <div>
            <h1 className="text-5xl font-outfit font-black text-white uppercase tracking-tight">Categories</h1>
            <p className="text-text-dim mt-1">Browse movies by category</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <Layers size={64} className="text-text-muted" />
            <p className="text-text-dim text-xl">No categories found.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {categories.map((category, i) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/categories/${category.id}`}
                  className="group block glass-panel rounded-3xl p-8 hover:border-brand-primary/40 transition-all hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center mb-5 group-hover:bg-brand-primary/20 transition-colors">
                    <Film size={24} className="text-brand-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2 group-hover:text-brand-primary transition-colors">
                    {category.name}
                  </h2>
                  <p className="text-text-dim text-sm font-semibold">
                    {category.movie_count} movie{category.movie_count !== 1 ? "s" : ""}
                  </p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <Footer />
    </main>
  );
}
