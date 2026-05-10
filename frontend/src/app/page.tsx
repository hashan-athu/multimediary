"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import SearchFilter from "@/components/SearchFilter";
import MovieSection from "@/components/MovieSection";
import Footer from "@/components/Footer";
import { Sparkles } from "lucide-react";
import { useState, useMemo } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data, isLoading } = useQuery({
    queryKey: ["public-movies"],
    queryFn: () => apiClient.movies.list({ per_page: 24 }),
  });

  const allMovies = data?.movies || [];
  
  const filteredMovies = useMemo(() => {
    if (!searchQuery) return allMovies;
    const lowerQuery = searchQuery.toLowerCase();
    return allMovies.filter(movie => 
      movie.name.toLowerCase().includes(lowerQuery) ||
      movie.description?.toLowerCase().includes(lowerQuery) ||
      movie.year.toString().includes(lowerQuery)
    );
  }, [allMovies, searchQuery]);

  const featuredMovies = allMovies.slice(0, 5);
  const trendingMovies = [...allMovies].reverse();

  return (
    <main className="min-h-screen bg-bg-deep flex flex-col">
      <Header />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(229,9,20,0.4)]" />
            <p className="text-brand-secondary font-bold tracking-[0.2em] animate-pulse">LOADING CINEMA...</p>
          </div>
        </div>
      ) : (
        <>
          <HeroCarousel movies={featuredMovies} />

          {/* Added z-30 to ensure this container doesn't block carousel buttons if they are at z-20, 
              but actually the carousel buttons should be z-40 and this should be z-20 or lower. 
              Let's keep this z-20 and fix carousel z-index. */}
          <div className="relative -mt-32 z-20 space-y-24 pb-20">
            <SearchFilter onSearch={(q) => setSearchQuery(q)} />

            <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-32">
              <MovieSection 
                title={searchQuery ? `Search Results: ${searchQuery}` : "Latest Releases"} 
                movies={filteredMovies} 
                viewAllHref={searchQuery ? undefined : "/movies"} 
              />

              {!searchQuery && (
                <>
                  {/* Genre Selection Section */}
                  <section className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-1.5 h-8 bg-brand-secondary rounded-full shadow-[0_0_10px_rgba(0,209,255,0.5)]" />
                      <h2 className="text-3xl font-outfit font-black tracking-tight text-white uppercase">
                        Browse by Genre
                      </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {["Action", "Comedy", "Thriller", "Horror", "Sci-Fi", "Drama"].map((genre) => (
                        <button 
                          key={genre}
                          className="group relative h-32 rounded-2xl overflow-hidden glass-panel hover:border-brand-secondary/50 transition-all"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary/10 to-transparent group-hover:from-brand-secondary/20 transition-all" />
                          <span className="relative font-bold text-lg text-white group-hover:scale-110 transition-transform block">
                            {genre}
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>

                  <MovieSection 
                    title="Top Trending" 
                    movies={trendingMovies} 
                    viewAllHref="/movies?sort=trending" 
                  />

                  {/* Promo Section */}
                  <section className="relative rounded-[40px] overflow-hidden p-12 md:p-24 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/40 to-brand-secondary/40 animate-gradient-x" />
                    <div className="absolute inset-0 bg-bg-surface/80 backdrop-blur-3xl" />
                    <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                      <Sparkles className="text-accent w-16 h-16 animate-bounce" />
                      <h2 className="text-5xl md:text-7xl font-outfit font-black text-white max-w-4xl leading-tight">
                        DISCOVER THE TRUE <span className="text-brand-primary">CINEMATIC</span> POWER AT YOUR FINGERTIPS
                      </h2>
                      <p className="text-xl text-text-dim max-w-2xl">
                        Join thousands of collectors and experience your physical media like never before.
                      </p>
                      <button className="btn-primary py-5 px-16 text-xl">
                        GET STARTED NOW
                      </button>
                    </div>
                  </section>
                </>
              )}
            </div>
          </div>
        </>
      )}

      <Footer />
    </main>
  );
}
