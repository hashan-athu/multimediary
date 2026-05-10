"use client";

import { useState } from "react";
import { 
  Search, 
  Database, 
  FileText, 
  CheckCircle, 
  ChevronRight, 
  ArrowLeft,
  Loader2,
  Film,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api";
import { TMDbSearchResult } from "@/types";
import PosterImage from "@/components/shared/PosterImage";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Mode = "tmdb" | "manual";
type Step = 1 | 2;

export default function NewMoviePage() {
  const [mode, setMode] = useState<Mode>("tmdb");
  const [step, setStep] = useState<Step>(1);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TMDbSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<TMDbSearchResult | null>(null);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const data = await apiClient.movies.tmdbSearch(query);
      setResults(data);
    } catch (error) {
      toast.error("Failed to search TMDb");
    } finally {
      setIsSearching(false);
    }
  };

  const selectMovie = (movie: TMDbSearchResult) => {
    setSelectedMovie(movie);
    setStep(2);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => step === 2 ? setStep(1) : router.back()}
          className="bg-white border border-[#E0E8EF] text-[#4F5C72] rounded-lg"
        >
          <ArrowLeft size={18} />
        </Button>
        <PageHeader 
          title="Add New Movie" 
          subtitle={mode === "tmdb" ? "Import metadata from TMDb" : "Enter movie details manually"}
          className="mb-0"
        />
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center">
        <div className="bg-[#EDF1F7] p-1.5 rounded-xl flex gap-1">
          <Button 
            variant="ghost" 
            className={cn(
              "h-10 px-8 rounded-lg font-bold text-sm transition-all",
              mode === "tmdb" ? "bg-white text-[#4299EB] shadow-sm" : "text-[#8892B0]"
            )}
            onClick={() => { setMode("tmdb"); setStep(1); }}
          >
            <Database size={16} className="mr-2" /> TMDb Import
          </Button>
          <Button 
            variant="ghost" 
            className={cn(
              "h-10 px-8 rounded-lg font-bold text-sm transition-all",
              mode === "manual" ? "bg-white text-[#4299EB] shadow-sm" : "text-[#8892B0]"
            )}
            onClick={() => setMode("manual")}
          >
            <FileText size={16} className="mr-2" /> Manual Entry
          </Button>
        </div>
      </div>

      {mode === "tmdb" ? (
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-4">
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all",
              step === 1 ? "bg-[#4299EB] text-white" : "bg-[#46BB78] text-white"
            )}>
              <span className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[10px]", step === 1 ? "bg-white text-[#4299EB]" : "bg-white text-[#46BB78]")}>1</span>
              Search
              {step === 2 && <CheckCircle size={14} className="ml-1" />}
            </div>
            <div className="w-12 h-px bg-[#E0E8EF]" />
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all",
              step === 2 ? "bg-[#4299EB] text-white" : "bg-[#EDF1F7] text-[#8892B0]"
            )}>
              <span className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[10px]", step === 2 ? "bg-white text-[#4299EB]" : "bg-white text-[#8892B0]")}>2</span>
              Configure
            </div>
          </div>

          {step === 1 ? (
            <div className="space-y-8">
              <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA5B8]" size={20} />
                <Input 
                  placeholder="Search for a movie by title..." 
                  className="pl-12 h-14 bg-white border border-[#E0E8EF] rounded-2xl shadow-sm text-lg focus-visible:ring-2 focus-visible:ring-[#4299EB]"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Button 
                  type="submit"
                  disabled={isSearching}
                  className="absolute right-2 top-2 bottom-2 bg-[#4299EB] hover:bg-[#3182CE] text-white rounded-xl px-6 font-bold"
                >
                  {isSearching ? <Loader2 size={18} className="animate-spin" /> : "Search"}
                </Button>
              </form>

              {results.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results?.map((result) => (
                    <div 
                      key={result.id} 
                      onClick={() => selectMovie(result)}
                      className="flex gap-4 p-4 bg-white rounded-2xl border border-[#E0E8EF] hover:border-[#4299EB] hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="w-20 aspect-[2/3] shrink-0 rounded-lg overflow-hidden bg-[#EDF1F7]">
                        <PosterImage 
                          src={result.poster_path ? `https://image.tmdb.org/t/p/w500${result.poster_path}` : null} 
                          alt={result.title} 
                          className="w-full h-full" 
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-bold text-[#1C2238] group-hover:text-[#4299EB] transition-colors">{result.title}</h4>
                        <p className="text-xs font-bold text-[#9AA5B8] flex items-center gap-1">
                          <Calendar size={12} /> {result.release_date?.split("-")[0] || "Unknown"}
                        </p>
                        <p className="text-[11px] text-[#4F5C72] line-clamp-3 leading-relaxed mt-2">
                          {result.overview}
                        </p>
                      </div>
                      <div className="self-center">
                        <div className="w-8 h-8 rounded-full bg-[#EDF1F7] flex items-center justify-center text-[#4299EB] group-hover:bg-[#4299EB] group-hover:text-white transition-all">
                          <ChevronRight size={18} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {results.length === 0 && !isSearching && query && (
                <div className="text-center py-20">
                  <Film size={48} className="text-[#C8D0DC] mx-auto mb-4" />
                  <p className="text-[#4F5C72] font-medium">No movies found for &ldquo;{query}&rdquo;</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Preview */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-[#E0E8EF] shadow-sm">
                  <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-6 shadow-lg">
                    <PosterImage 
                      src={selectedMovie?.poster_path ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}` : null} 
                      alt={selectedMovie?.title || ""} 
                      className="w-full h-full" 
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 rounded-full bg-[#46BB78] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                        <CheckCircle size={12} /> TMDb Verified
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#1C2238] mb-2">{selectedMovie?.title}</h3>
                  <p className="text-sm text-[#4F5C72] line-clamp-4 leading-relaxed mb-6">
                    {selectedMovie?.overview}
                  </p>
                  
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-[#9AA5B8] uppercase tracking-wider">What will be imported</p>
                    <div className="grid grid-cols-2 gap-3">
                      {["Poster & Plot", "Tagline", "Runtime", "Director", "Full Cast", "Genres"].map((item) => (
                        <div key={item} className="flex items-center gap-2 text-xs font-bold text-[#46BB78]">
                          <CheckCircle size={14} /> {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-3">
                <div className="bg-white p-8 rounded-3xl border border-[#E0E8EF] shadow-sm space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 col-span-2">
                      <label className="text-[11px] font-bold text-[#4F5C72] uppercase tracking-wider">Assign to Disk*</label>
                      <select className="w-full h-11 bg-[#EDF1F7] border-none rounded-xl px-4 text-sm font-medium focus:ring-2 focus:ring-[#4299EB] outline-none">
                        <option>Select a disk...</option>
                        <option>Movies HDD (1.2TB free)</option>
                        <option>Classics DVD Case</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-[#4F5C72] uppercase tracking-wider">Category*</label>
                      <select className="w-full h-11 bg-[#EDF1F7] border-none rounded-xl px-4 text-sm font-medium focus:ring-2 focus:ring-[#4299EB] outline-none">
                        <option>Hollywood</option>
                        <option>Bollywood</option>
                        <option>Tamil</option>
                        <option>Sinhala</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-[#4F5C72] uppercase tracking-wider">Quality*</label>
                      <div className="flex flex-wrap gap-2">
                        {["4K", "1080p", "720p", "DVDRip"].map(q => (
                          <button key={q} className="px-3 py-1.5 rounded-lg bg-[#EDF1F7] text-[#4F5C72] text-[10px] font-bold hover:bg-[#4299EB] hover:text-white transition-colors">
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-[#4F5C72] uppercase tracking-wider">File Size (MB)</label>
                      <Input type="number" placeholder="2400" className="h-11 bg-[#EDF1F7] border-none rounded-xl" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-[#4F5C72] uppercase tracking-wider">Version</label>
                      <Input placeholder="Director's Cut" className="h-11 bg-[#EDF1F7] border-none rounded-xl" />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#E0E8EF]">
                    <Button className="w-full h-12 bg-[#4299EB] hover:bg-[#3182CE] text-white font-bold rounded-xl shadow-sm active:scale-[0.98] transition-all">
                      Import Movie to Library
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl border border-[#E0E8EF] shadow-sm">
          <p className="text-center text-[#4F5C72] py-20 font-medium italic">Manual entry form implementation follows standard Movie interfaces...</p>
        </div>
      )}
    </div>
  );
}
