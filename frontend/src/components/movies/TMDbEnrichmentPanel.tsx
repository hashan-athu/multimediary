"use client";

import { useState } from "react";
import { Wand2, ChevronDown, ChevronUp, Check, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api, apiClient, extractApiError } from "@/lib/adminApi";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import type { Actor, Director, Genre, TMDbSearchResult } from "@/types";

const ENRICHABLE_FIELDS = [
  { key: "name",        label: "Title" },
  { key: "year",        label: "Year" },
  { key: "description", label: "Plot summary" },
  { key: "story",       label: "Full story (same as plot)" },
  { key: "tagline",     label: "Tagline" },
  { key: "runtime",     label: "Runtime" },
  { key: "language",    label: "Language" },
  { key: "country",     label: "Country" },
  { key: "poster_url",  label: "Poster image" },
  { key: "tmdb_id",     label: "TMDb ID" },
  { key: "genre_ids",   label: "Genres (matched to library)" },
  { key: "director_id", label: "Director (matched to library)" },
  { key: "actor_ids",   label: "Cast — top 10 (matched to library)" },
] as const;

type EnrichableKey = typeof ENRICHABLE_FIELDS[number]["key"];

interface TMDbEnrichmentPanelProps {
  currentTmdbId?: number | null;
  onEnrich: (
    fields: Partial<Record<string, unknown>>,
    matched: {
      director?: Director | null;
      actors?: Actor[];
      genres?: Genre[];
      tmdbRating?: { rating_value: number; rating_out_of: number } | null;
    }
  ) => void;
}

interface TMDbPerson {
  first_name?: string | null;
  last_name?: string | null;
  image_url?: string | null;
}

const normalized = (value?: string | null) => value?.trim().toLowerCase() ?? "";

const personMatches = (person: Pick<Actor | Director, "first_name" | "last_name">, tmdbPerson: TMDbPerson) =>
  normalized(person.first_name) === normalized(tmdbPerson.first_name) &&
  normalized(person.last_name) === normalized(tmdbPerson.last_name);

const personPayload = (person: TMDbPerson) => ({
  first_name: person.first_name?.trim() || "Unknown",
  last_name: person.last_name?.trim() || "Unknown",
  image_url: person.image_url || undefined,
});

export function TMDbEnrichmentPanel({ currentTmdbId, onEnrich }: TMDbEnrichmentPanelProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"search" | "select-fields">("search");
  const [query, setQuery] = useState("");
  const [selectedResult, setSelectedResult] = useState<TMDbSearchResult | null>(null);
  const [checkedFields, setCheckedFields] = useState<Set<EnrichableKey>>(
    new Set(ENRICHABLE_FIELDS.map((f) => f.key))
  );
  const [applying, setApplying] = useState(false);
  const debouncedQuery = useDebounce(query, 400);

  const { data: results = [], isFetching } = useQuery<TMDbSearchResult[]>({
    queryKey: ["tmdb-enrich-search", debouncedQuery],
    queryFn: () =>
      debouncedQuery.length >= 2
        ? api.post("/admin/movies/tmdb_search", { query: debouncedQuery }).then((r) => r.data.results ?? [])
        : Promise.resolve([]),
    enabled: debouncedQuery.length >= 2,
    staleTime: 30_000,
  });

  const handleSelectResult = (result: TMDbSearchResult) => {
    setSelectedResult(result);
    setStep("select-fields");
    setQuery("");
  };

  const findOrCreateGenre = async (name: string): Promise<Genre> => {
    const genresRes = await apiClient.genres.list({ per_page: 200 });
    const existing = genresRes.genres.find((g) => normalized(g.name) === normalized(name));
    return existing ?? apiClient.genres.create({ name });
  };

  const findOrCreateDirector = async (director: TMDbPerson): Promise<Director> => {
    const directorsRes = await apiClient.directors.list({
      "q[first_name_or_last_name_cont]": director.last_name || director.first_name || undefined,
      per_page: 10,
    });
    const existing = directorsRes.directors.find((d) => personMatches(d, director));
    return existing ?? apiClient.directors.create(personPayload(director));
  };

  const findOrCreateActor = async (actor: TMDbPerson): Promise<Actor> => {
    const actorsRes = await apiClient.actors.list({
      "q[first_name_or_last_name_cont]": actor.last_name || actor.first_name || undefined,
      per_page: 10,
    });
    const existing = actorsRes.actors.find((a) => personMatches(a, actor));
    return existing ?? apiClient.actors.create(personPayload(actor));
  };

  const handleApply = async () => {
    if (!selectedResult) return;
    setApplying(true);
    try {
      const previewRes = await api.post("/admin/movies/tmdb_preview", { tmdb_id: selectedResult.id });
      const data = previewRes.data;

      const tmdbGenreNames: string[] = data.genres ?? [];
      const matchedGenres = checkedFields.has("genre_ids")
        ? await Promise.all(tmdbGenreNames.map((name) => findOrCreateGenre(name)))
        : [];

      const matchedDirector = checkedFields.has("director_id") && data.director
        ? await findOrCreateDirector(data.director)
        : null;

      const matchedActors = checkedFields.has("actor_ids") && data.actors?.length > 0
        ? await Promise.all(data.actors.slice(0, 10).map((actor: TMDbPerson) => findOrCreateActor(actor)))
        : [];

      const toApply: Partial<Record<string, unknown>> = {};
      if (checkedFields.has("name"))        toApply.name        = data.name;
      if (checkedFields.has("year"))        toApply.year        = data.year ? Number(data.year) : null;
      if (checkedFields.has("description")) toApply.description = data.description;
      if (checkedFields.has("story"))       toApply.story       = data.description;
      if (checkedFields.has("tagline"))     toApply.tagline     = data.tagline;
      if (checkedFields.has("runtime"))     toApply.runtime     = data.runtime ? Number(data.runtime) : null;
      if (checkedFields.has("language"))    toApply.language    = data.language;
      if (checkedFields.has("country"))     toApply.country     = data.country;
      if (checkedFields.has("poster_url"))  toApply.poster_url  = data.poster_url;
      if (checkedFields.has("tmdb_id"))     toApply.tmdb_id     = data.tmdb_id ? Number(data.tmdb_id) : null;
      if (checkedFields.has("genre_ids"))   toApply.genre_ids   = matchedGenres.map((g) => g.id);
      if (checkedFields.has("director_id") && matchedDirector)
                                            toApply.director_id = matchedDirector.id;
      if (checkedFields.has("actor_ids"))   toApply.actor_ids   = matchedActors.map((a) => a.id);

      onEnrich(toApply, {
        director: matchedDirector,
        actors: matchedActors,
        genres: matchedGenres,
        tmdbRating: data.vote_average?.toString() && Number(data.vote_average) > 0
          ? { rating_value: Math.round(Number(data.vote_average) * 10) / 10, rating_out_of: 10 }
          : null,
      });

      if (matchedGenres.length > 0 || matchedDirector || matchedActors.length > 0) {
        toast.success("TMDb people and genres are ready in your library");
      }

      setOpen(false);
      setStep("search");
      setSelectedResult(null);
    } catch (err) {
      toast.error(extractApiError(err));
    } finally {
      setApplying(false);
    }
  };

  const toggleField = (key: EnrichableKey) => {
    setCheckedFields((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <div className="rounded-xl border border-[#4299EB]/30 overflow-hidden bg-[#EEF4FF]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-[#E5EFFF] transition-colors"
      >
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#4299EB] flex-shrink-0">
          <Wand2 className="h-3.5 w-3.5 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-[#1C2238]">
            {currentTmdbId
              ? `Linked to TMDb #${currentTmdbId} — re-enrich from TMDb`
              : "Pre-fill fields from TMDb"}
          </div>
          <div className="text-xs text-[#9AA5B8]">
            Search TMDb and selectively import any fields into this form
          </div>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-[#9AA5B8]" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[#9AA5B8]" />
        )}
      </button>

      {open && (
        <div className="border-t border-[#4299EB]/20 bg-white p-5 space-y-4">
          {step === "search" && (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9AA5B8]" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search TMDb by title..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#EDF1F7] text-sm text-[#1C2238] placeholder:text-[#9AA5B8] outline-none focus:ring-2 focus:ring-[#4299EB]"
                  autoFocus
                />
              </div>

              {isFetching && (
                <p className="text-xs text-[#9AA5B8] text-center py-2">Searching TMDb…</p>
              )}

              {results.length > 0 && (
                <ul className="divide-y divide-[#E0E8EF] border border-[#E0E8EF] rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                  {results.slice(0, 8).map((r) => (
                    <li key={r.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectResult(r)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-[#EDF1F7] transition-colors"
                      >
                        {r.poster_path && (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={`https://image.tmdb.org/t/p/w92${r.poster_path}`}
                            alt=""
                            className="w-8 h-12 object-cover rounded flex-shrink-0 bg-[#EDF1F7]"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-[#1C2238] truncate">{r.title}</div>
                          <div className="text-xs text-[#9AA5B8]">{r.release_date?.slice(0, 4)}</div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {debouncedQuery.length >= 2 && !isFetching && results.length === 0 && (
                <p className="text-sm text-[#9AA5B8] text-center py-4">
                  No results for &ldquo;{debouncedQuery}&rdquo;
                </p>
              )}
            </>
          )}

          {step === "select-fields" && selectedResult && (
            <>
              <div className="flex items-center gap-3 p-3 bg-[#EDF1F7] rounded-lg">
                {selectedResult.poster_path && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={`https://image.tmdb.org/t/p/w92${selectedResult.poster_path}`}
                    alt=""
                    className="w-10 h-14 object-cover rounded flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <div className="text-sm font-semibold text-[#1C2238]">{selectedResult.title}</div>
                  <div className="text-xs text-[#9AA5B8]">
                    {selectedResult.release_date?.slice(0, 4)} · TMDb #{selectedResult.id}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedResult(null); setStep("search"); }}
                  className="text-xs text-[#4299EB] hover:underline"
                >
                  Change
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-[#4F5C72]">Select fields to import:</p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCheckedFields(new Set(ENRICHABLE_FIELDS.map((f) => f.key)))}
                      className="text-xs text-[#4299EB] hover:underline"
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setCheckedFields(new Set())}
                      className="text-xs text-[#9AA5B8] hover:underline"
                    >
                      None
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {ENRICHABLE_FIELDS.map((field) => (
                    <label key={field.key} className="flex items-center gap-2 cursor-pointer py-1">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                          checkedFields.has(field.key)
                            ? "bg-[#4299EB] border-[#4299EB]"
                            : "border-[#E0E8EF] bg-white"
                        }`}
                        onClick={() => toggleField(field.key)}
                      >
                        {checkedFields.has(field.key) && <Check className="h-2.5 w-2.5 text-white" />}
                      </div>
                      <span className="text-xs text-[#4F5C72]">{field.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleApply}
                  disabled={applying || checkedFields.size === 0}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#4299EB] text-white text-sm font-semibold rounded-lg hover:bg-[#3182CE] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {applying && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {applying
                    ? "Applying…"
                    : `Apply ${checkedFields.size} field${checkedFields.size !== 1 ? "s" : ""}`}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2.5 bg-[#EDF1F7] text-[#4F5C72] text-sm font-medium rounded-lg hover:bg-[#E2E8F0] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
