"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Search, Database, FileText, CheckCircle, ChevronRight,
  ArrowLeft, Loader2, Film, Calendar, Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";
import { apiClient, extractApiError } from "@/lib/api";
import { TMDbSearchResult, Category, Disk, Quality } from "@/types";
import PosterImage from "@/components/shared/PosterImage";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Mode = "tmdb" | "manual";
type Step = 1 | 2;

const fieldLabel = "text-[11px] font-bold text-[#4F5C72] uppercase tracking-wider";
const fieldInput = "h-11 bg-[#EDF1F7] border-none rounded-xl";
const fieldSelect = "w-full h-11 bg-[#EDF1F7] border-none rounded-xl px-4 text-sm font-medium text-[#1C2238] outline-none focus:ring-2 focus:ring-[#4299EB]";

// ── Manual Form ────────────────────────────────────────────────────────────
function ManualMovieForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: catsData } = useQuery({ queryKey: ["categories"], queryFn: () => apiClient.categories.list() });
  const { data: disksData } = useQuery({ queryKey: ["disks"], queryFn: () => apiClient.disks.list() });
  const { data: dirsData } = useQuery({ queryKey: ["directors"], queryFn: () => apiClient.directors.list() });

  const categories = catsData?.categories ?? [];
  const disks = disksData?.disks ?? [];
  const directors = dirsData?.directors ?? [];

  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [language, setLanguage] = useState("");
  const [country, setCountry] = useState("");
  const [tagline, setTagline] = useState("");
  const [runtime, setRuntime] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [version, setVersion] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [description, setDescription] = useState("");
  const [story, setStory] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [diskId, setDiskId] = useState("");
  const [directorId, setDirectorId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("Title is required"); return; }
    if (!categoryId) { toast.error("Category is required"); return; }
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = { name: name.trim(), category_id: Number(categoryId) };
      if (year) payload.year = Number(year);
      if (language) payload.language = language;
      if (country) payload.country = country;
      if (tagline) payload.tagline = tagline;
      if (runtime) payload.runtime = Number(runtime);
      if (fileSize) payload.file_size = fileSize;
      if (version) payload.version = version;
      if (posterUrl) payload.poster_url = posterUrl;
      if (description) payload.description = description;
      if (story) payload.story = story;
      if (diskId) payload.disk_id = Number(diskId);
      if (directorId) payload.director_id = Number(directorId);

      const movie = await apiClient.movies.create(payload);
      toast.success(`"${movie.name}" added to library`);
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      router.push(`/admin/movies/${movie.id}`);
    } catch (err) {
      toast.error(extractApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Column 1 — Primary info */}
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className={fieldLabel}>Title *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Inception" className={fieldInput} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={fieldLabel}>Year</label>
              <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2010" className={fieldInput} />
            </div>
            <div className="space-y-1.5">
              <label className={fieldLabel}>Runtime (min)</label>
              <Input type="number" value={runtime} onChange={(e) => setRuntime(e.target.value)} placeholder="148" className={fieldInput} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={fieldLabel}>Language</label>
              <Input value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="English" className={fieldInput} />
            </div>
            <div className="space-y-1.5">
              <label className={fieldLabel}>Country</label>
              <Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="USA" className={fieldInput} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={fieldLabel}>Tagline</label>
            <Input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Your mind is the scene of the crime." className={fieldInput} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={fieldLabel}>File Size (MB)</label>
              <Input value={fileSize} onChange={(e) => setFileSize(e.target.value)} placeholder="1456" className={fieldInput} />
            </div>
            <div className="space-y-1.5">
              <label className={fieldLabel}>Version</label>
              <Input value={version} onChange={(e) => setVersion(e.target.value)} placeholder="Director's Cut" className={fieldInput} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={fieldLabel}>Poster URL</label>
            <Input value={posterUrl} onChange={(e) => setPosterUrl(e.target.value)} placeholder="https://..." className={fieldInput} />
            {posterUrl && (
              <div className="w-20 aspect-[2/3] rounded-lg overflow-hidden mt-2">
                <PosterImage src={posterUrl} alt="Preview" className="w-full h-full" />
              </div>
            )}
          </div>
        </div>

        {/* Column 2 — Relationships */}
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className={fieldLabel}>Category *</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={fieldSelect}>
              <option value="">Select category…</option>
              {categories.map((c: Category) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className={fieldLabel}>Disk</label>
            <select value={diskId} onChange={(e) => setDiskId(e.target.value)} className={fieldSelect}>
              <option value="">Select disk…</option>
              {disks.map((d: Disk) => (
                <option key={d.id} value={d.id}>{d.name} ({d.disk_format?.name})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className={fieldLabel}>Director</label>
            <select value={directorId} onChange={(e) => setDirectorId(e.target.value)} className={fieldSelect}>
              <option value="">Select director…</option>
              {directors.map((d) => <option key={d.id} value={d.id}>{d.full_name}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className={fieldLabel}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
              placeholder="Brief plot overview…"
              className="w-full p-4 bg-[#EDF1F7] border-none rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#4299EB] resize-none" />
          </div>

          <div className="space-y-1.5">
            <label className={fieldLabel}>Story</label>
            <textarea value={story} onChange={(e) => setStory(e.target.value)} rows={6}
              placeholder="Full plot synopsis…"
              className="w-full p-4 bg-[#EDF1F7] border-none rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#4299EB] resize-none" />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-[#E0E8EF]">
        <Button type="submit" disabled={submitting}
          className="h-12 px-10 bg-[#4299EB] hover:bg-[#3182CE] text-white font-bold rounded-xl shadow-sm">
          {submitting ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
          Save Movie
        </Button>
      </div>
    </form>
  );
}

// ── TMDb Import Step 2 — Configure ────────────────────────────────────────
function TMDbConfigureStep({
  selected,
  onBack,
}: {
  selected: TMDbSearchResult;
  onBack: () => void;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: catsData } = useQuery({ queryKey: ["categories"], queryFn: () => apiClient.categories.list() });
  const { data: disksData } = useQuery({ queryKey: ["disks"], queryFn: () => apiClient.disks.list() });
  const { data: qualData } = useQuery({ queryKey: ["qualities"], queryFn: () => apiClient.qualities.list() });

  const categories = catsData?.categories ?? [];
  const disks = disksData?.disks ?? [];
  const qualities = qualData?.qualities ?? [];

  const [diskId, setDiskId] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [selectedQualityIds, setSelectedQualityIds] = useState<number[]>([]);
  const [fileSize, setFileSize] = useState("");
  const [version, setVersion] = useState("");
  const [importing, setImporting] = useState(false);

  const toggleQuality = (id: number) =>
    setSelectedQualityIds((prev) => prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]);

  const handleImport = async () => {
    if (!diskId || !categoryId) {
      toast.error("Disk and Category are required");
      return;
    }
    setImporting(true);
    try {
      const movie = await apiClient.movies.tmdbImport({
        tmdb_id: selected.id,
        disk_id: diskId,
        category_id: categoryId,
        quality_ids: selectedQualityIds.length > 0 ? selectedQualityIds : undefined,
        file_size: fileSize || undefined,
        version: version || undefined,
      });
      toast.success(`"${movie.name}" imported successfully`);
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      router.push(`/admin/movies/${movie.id}`);
    } catch (err: unknown) {
      const ax = err as { response?: { status?: number; data?: { movie?: { id: number; name: string } } } };
      if (ax?.response?.status === 409 && ax.response.data?.movie) {
        const existing = ax.response.data.movie;
        toast.error(
          <span>
            Already imported —{" "}
            <a href={`/admin/movies/${existing.id}`} className="underline font-bold">
              View &ldquo;{existing.name}&rdquo;
            </a>
          </span>
        );
      } else {
        toast.error(extractApiError(err));
      }
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Preview */}
      <div className="lg:col-span-2">
        <div className="bg-white p-6 rounded-3xl border border-[#E0E8EF] shadow-sm space-y-4">
          <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-lg">
            <PosterImage
              src={selected.poster_path ? `https://image.tmdb.org/t/p/w500${selected.poster_path}` : null}
              alt={selected.title}
              className="w-full h-full"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1.5 rounded-full bg-[#46BB78] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                <CheckCircle size={12} /> TMDb Verified
              </span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-[#1C2238]">{selected.title}</h3>
          <p className="text-sm text-[#4F5C72] line-clamp-4 leading-relaxed">{selected.overview}</p>
          <div className="grid grid-cols-2 gap-2 pt-2">
            {["Poster & Plot", "Tagline", "Runtime", "Director", "Full Cast", "Genres"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-xs font-bold text-[#46BB78]">
                <CheckCircle size={13} /> {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Configure form */}
      <div className="lg:col-span-3">
        <div className="bg-white p-8 rounded-3xl border border-[#E0E8EF] shadow-sm space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#4F5C72] uppercase tracking-wider">Assign to Disk*</label>
            <select
              value={diskId ?? ""}
              onChange={(e) => setDiskId(Number(e.target.value) || null)}
              className="w-full h-11 bg-[#EDF1F7] border-none rounded-xl px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-[#4299EB]"
            >
              <option value="">Select a disk…</option>
              {disks.map((d: Disk) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.disk_format?.name} · {d.movie_count} movies)
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#4F5C72] uppercase tracking-wider">Category*</label>
            <select
              value={categoryId ?? ""}
              onChange={(e) => setCategoryId(Number(e.target.value) || null)}
              className="w-full h-11 bg-[#EDF1F7] border-none rounded-xl px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-[#4299EB]"
            >
              <option value="">Select category…</option>
              {categories.map((c: Category) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {qualities.length > 0 && (
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#4F5C72] uppercase tracking-wider">Quality</label>
              <div className="flex flex-wrap gap-2">
                {qualities.map((q: Quality) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => toggleQuality(q.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors border",
                      selectedQualityIds.includes(q.id)
                        ? "bg-[#4299EB] text-white border-[#4299EB]"
                        : "bg-[#EDF1F7] text-[#4F5C72] border-transparent"
                    )}
                  >
                    {q.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#4F5C72] uppercase tracking-wider">File Size (MB)</label>
              <Input value={fileSize} onChange={(e) => setFileSize(e.target.value)}
                placeholder="2400" className="h-11 bg-[#EDF1F7] border-none rounded-xl" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#4F5C72] uppercase tracking-wider">Version</label>
              <Input value={version} onChange={(e) => setVersion(e.target.value)}
                placeholder="Director&apos;s Cut" className="h-11 bg-[#EDF1F7] border-none rounded-xl" />
            </div>
          </div>

          <div className="pt-4 border-t border-[#E0E8EF] flex gap-3">
            <Button onClick={onBack} variant="ghost"
              className="h-12 px-6 bg-[#EDF1F7] text-[#4F5C72] font-bold rounded-xl">
              Back
            </Button>
            <Button onClick={handleImport} disabled={importing}
              className="flex-1 h-12 bg-[#4299EB] hover:bg-[#3182CE] text-white font-bold rounded-xl shadow-sm">
              {importing ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
              Import Movie to Library
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
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
    } catch {
      toast.error("Failed to search TMDb — check your API key and backend connection");
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
        <Button variant="ghost" size="icon"
          onClick={() => (step === 2 ? setStep(1) : router.back())}
          className="bg-white border border-[#E0E8EF] text-[#4F5C72] rounded-lg">
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
          {[
            { value: "tmdb" as Mode, icon: Database, label: "TMDb Import" },
            { value: "manual" as Mode, icon: FileText, label: "Manual Entry" },
          ].map(({ value, icon: Icon, label }) => (
            <Button key={value} variant="ghost"
              className={cn(
                "h-10 px-8 rounded-lg font-bold text-sm transition-all",
                mode === value ? "bg-white text-[#4299EB] shadow-sm" : "text-[#8892B0]"
              )}
              onClick={() => { setMode(value); setStep(1); }}>
              <Icon size={16} className="mr-2" /> {label}
            </Button>
          ))}
        </div>
      </div>

      {mode === "tmdb" ? (
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-4">
            {[
              { n: 1, label: "Search" },
              { n: 2, label: "Configure" },
            ].map(({ n, label }, i) => (
              <div key={n} className="flex items-center gap-2">
                {i > 0 && <div className="w-12 h-px bg-[#E0E8EF]" />}
                <div className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider",
                  step > n ? "bg-[#46BB78] text-white" :
                  step === n ? "bg-[#4299EB] text-white" : "bg-[#EDF1F7] text-[#8892B0]"
                )}>
                  <span className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px]",
                    step > n ? "bg-white text-[#46BB78]" :
                    step === n ? "bg-white text-[#4299EB]" : "bg-white text-[#8892B0]"
                  )}>{n}</span>
                  {label}
                  {step > n && <CheckCircle size={14} className="ml-1" />}
                </div>
              </div>
            ))}
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
                <Button type="submit" disabled={isSearching}
                  className="absolute right-2 top-2 bottom-2 bg-[#4299EB] hover:bg-[#3182CE] text-white rounded-xl px-6 font-bold">
                  {isSearching ? <Loader2 size={18} className="animate-spin" /> : "Search"}
                </Button>
              </form>

              {results.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.map((result) => (
                    <div key={result.id} onClick={() => selectMovie(result)}
                      className="flex gap-4 p-4 bg-white rounded-2xl border border-[#E0E8EF] hover:border-[#4299EB] hover:shadow-md transition-all cursor-pointer group">
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
                        <p className="text-[11px] text-[#4F5C72] line-clamp-3 leading-relaxed mt-2">{result.overview}</p>
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

              {!isSearching && query && results.length === 0 && (
                <div className="text-center py-20">
                  <Film size={48} className="text-[#C8D0DC] mx-auto mb-4" />
                  <p className="text-[#4F5C72] font-medium">No movies found for &ldquo;{query}&rdquo;</p>
                </div>
              )}
            </div>
          ) : selectedMovie ? (
            <TMDbConfigureStep selected={selectedMovie} onBack={() => setStep(1)} />
          ) : null}
        </div>
      ) : (
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-3xl border border-[#E0E8EF] shadow-sm">
          <ManualMovieForm />
        </div>
      )}
    </div>
  );
}
