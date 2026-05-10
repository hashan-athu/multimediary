"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import {
  ArrowLeft, Edit2, Trash2, Clock, Globe, MapPin, Star, ExternalLink,
  Plus, X, Loader2, Save,
} from "lucide-react";
import { apiClient, extractApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PosterImage from "@/components/shared/PosterImage";
import { DiskBadge, TMDbBadge, QualityBadge } from "@/components/shared/Badges";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Actor, Rating, Reviewer } from "@/types";

function useMovieId() {
  const { id } = useParams();
  return Number(id);
}

// ── Actor search for Cast tab ──────────────────────────────────────────────
function ActorSearch({
  currentActorIds,
  onAdd,
}: {
  currentActorIds: number[];
  onAdd: (actor: Actor) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (value: string) => {
    setQuery(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!value.trim()) { setResults([]); return; }
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const { actors } = await apiClient.actors.list({ "q[first_name_or_last_name_cont]": value });
        setResults(actors.filter((a) => !currentActorIds.includes(a.id)));
      } finally {
        setLoading(false);
      }
    }, 350);
  };

  return (
    <div className="relative max-w-xs">
      <Input
        placeholder="Search actor name..."
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        className="h-9 bg-[#EDF1F7] border-none text-sm"
      />
      {(results.length > 0 || loading) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E0E8EF] rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
          {loading && <div className="p-3 text-sm text-[#9AA5B8]">Searching…</div>}
          {results.map((actor) => (
            <button
              key={actor.id}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#EDF1F7] text-left"
              onClick={() => { onAdd(actor); setQuery(""); setResults([]); }}
            >
              <Avatar className="h-7 w-7">
                <AvatarImage src={actor.image_url} />
                <AvatarFallback className="bg-[#4299EB]/10 text-[#4299EB] text-[10px] font-bold">
                  {actor.first_name?.[0]}{actor.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-[#1C2238]">{actor.full_name}</span>
              <span className="text-[10px] text-[#9AA5B8] ml-auto">{actor.nationality}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Rating form ────────────────────────────────────────────────────────────
function RatingForm({
  movieId,
  existingRating,
  onSuccess,
  onCancel,
}: {
  movieId: number;
  existingRating?: Rating | null;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const { data: reviewersData } = useQuery({
    queryKey: ["reviewers"],
    queryFn: () => apiClient.reviewers.list(),
  });
  const reviewers = reviewersData?.reviewers ?? [];

  const [reviewerId, setReviewerId] = useState<number>(existingRating?.reviewer?.id ?? 0);
  const [value, setValue] = useState(existingRating?.rating_value?.toString() ?? "");
  const [outOf, setOutOf] = useState(existingRating?.rating_out_of?.toString() ?? "10");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!reviewerId || !value || !outOf) { setError("All fields required"); return; }
    setSaving(true);
    setError("");
    try {
      if (existingRating) {
        await apiClient.ratings.update(movieId, existingRating.id, {
          rating_value: parseFloat(value),
          rating_out_of: parseFloat(outOf),
          reviewer_id: reviewerId,
        });
        toast.success("Rating updated");
      } else {
        await apiClient.ratings.create(movieId, {
          rating_value: parseFloat(value),
          rating_out_of: parseFloat(outOf),
          reviewer_id: reviewerId,
        });
        toast.success("Rating added");
      }
      onSuccess();
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#EDF1F7] rounded-xl p-5 space-y-4 max-w-md">
      {error && <p className="text-[#F25959] text-sm font-medium">{error}</p>}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-[#4F5C72] uppercase tracking-wider">Reviewer*</label>
        <select
          value={reviewerId}
          onChange={(e) => setReviewerId(Number(e.target.value))}
          className="w-full h-10 bg-white border border-[#E0E8EF] rounded-lg px-3 text-sm font-medium focus:ring-2 focus:ring-[#4299EB] outline-none"
        >
          <option value={0}>Select reviewer…</option>
          {reviewers.map((r: Reviewer) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-4">
        <div className="flex-1 space-y-1.5">
          <label className="text-[11px] font-bold text-[#4F5C72] uppercase tracking-wider">Rating*</label>
          <Input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="8.5"
            className="h-10 bg-white border-[#E0E8EF]"
          />
        </div>
        <div className="flex-1 space-y-1.5">
          <label className="text-[11px] font-bold text-[#4F5C72] uppercase tracking-wider">Out of*</label>
          <Input
            type="number"
            value={outOf}
            onChange={(e) => setOutOf(e.target.value)}
            placeholder="10"
            className="h-10 bg-white border-[#E0E8EF]"
          />
        </div>
      </div>
      <div className="flex gap-3">
        <Button
          onClick={handleSubmit}
          disabled={saving}
          className="h-9 bg-[#4299EB] hover:bg-[#3182CE] text-white font-bold text-sm px-6"
        >
          {saving ? <Loader2 size={14} className="animate-spin mr-1.5" /> : <Save size={14} className="mr-1.5" />}
          {existingRating ? "Update" : "Add Rating"}
        </Button>
        <Button variant="ghost" onClick={onCancel} className="h-9 bg-white text-[#4F5C72] font-bold text-sm px-4">
          Cancel
        </Button>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function MovieDetailPage() {
  const movieId = useMovieId();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: movie, isLoading } = useQuery({
    queryKey: ["movies", movieId],
    queryFn: () => apiClient.movies.get(movieId),
    enabled: !isNaN(movieId),
  });

  const { data: ratings, refetch: refetchRatings } = useQuery({
    queryKey: ["movies", movieId, "ratings"],
    queryFn: () => apiClient.ratings.list(movieId),
    enabled: !isNaN(movieId),
  });

  // Inline edit state
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [savingField, setSavingField] = useState(false);

  // Ratings form state
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [editingRating, setEditingRating] = useState<Rating | null>(null);

  const invalidateMovie = () => queryClient.invalidateQueries({ queryKey: ["movies", movieId] });

  // ── Inline field save ──
  const startEditField = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue ?? "");
  };

  const saveField = async (field: string) => {
    if (!movie) return;
    setSavingField(true);
    try {
      await apiClient.movies.update(movieId, { [field]: editValue });
      toast.success("Saved");
      invalidateMovie();
      setEditingField(null);
    } catch (err) {
      toast.error(extractApiError(err));
    } finally {
      setSavingField(false);
    }
  };

  // ── Delete movie ──
  const handleDeleteMovie = async () => {
    try {
      await apiClient.movies.delete(movieId);
      toast.success("Movie deleted");
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      router.push("/admin/movies");
    } catch (err) {
      toast.error(extractApiError(err));
    }
  };

  // ── Cast management ──
  const handleRemoveActor = async (actorId: number) => {
    if (!movie) return;
    const newIds = movie.actors.filter((a) => a.id !== actorId).map((a) => a.id);
    try {
      await apiClient.movies.update(movieId, { actor_ids: newIds });
      toast.success("Actor removed");
      invalidateMovie();
    } catch (err) {
      toast.error(extractApiError(err));
    }
  };

  const handleAddActor = async (actor: Actor) => {
    if (!movie) return;
    const newIds = [...movie.actors.map((a) => a.id), actor.id];
    try {
      await apiClient.movies.update(movieId, { actor_ids: newIds });
      toast.success(`${actor.full_name} added`);
      invalidateMovie();
    } catch (err) {
      toast.error(extractApiError(err));
    }
  };

  // ── Rating management ──
  const handleDeleteRating = async (ratingId: number) => {
    try {
      await apiClient.ratings.delete(movieId, ratingId);
      toast.success("Rating deleted");
      refetchRatings();
    } catch (err) {
      toast.error(extractApiError(err));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-[#EDF1F7] animate-pulse rounded-lg" />
        <div className="h-64 bg-[#EDF1F7] animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (!movie) return <div className="text-center py-20 text-[#4F5C72]">Movie not found</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Breadcrumb & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="bg-white border border-[#E0E8EF] text-[#4F5C72] rounded-lg"
          >
            <ArrowLeft size={18} />
          </Button>
          <div className="flex items-center gap-2 text-sm font-medium text-[#4F5C72]">
            <Link href="/admin/movies" className="hover:text-[#4299EB]">Movies</Link>
            <span className="text-[#9AA5B8]">/</span>
            <span className="text-[#1C2238] font-bold">{movie.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ConfirmDialog
            title={`Delete "${movie.name}"?`}
            description="This cannot be undone. The movie and all its ratings will be permanently removed."
            confirmLabel="Delete Movie"
            variant="destructive"
            onConfirm={handleDeleteMovie}
          >
            <Button variant="ghost" className="bg-[#F25959]/10 text-[#F25959] font-bold border border-[#F25959]/20 h-10 px-6">
              <Trash2 size={16} className="mr-2" /> Delete
            </Button>
          </ConfirmDialog>
        </div>
      </div>

      {/* Hero Card */}
      <Card className="p-8 border-none shadow-sm bg-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4299EB] opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="flex flex-col md:flex-row gap-8 relative z-10">
          <div className="w-48 aspect-[2/3] shrink-0">
            <PosterImage src={movie.poster_url} alt={movie.name} className="w-full h-full shadow-lg" />
          </div>
          <div className="flex-1 space-y-6">
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((g) => (
                <span key={g.id} className="px-3 py-1 rounded-full bg-[#4299EB]/10 text-[#4299EB] text-xs font-bold border border-[#4299EB]/20">
                  {g.name}
                </span>
              ))}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#1C2238] tracking-tight mb-2">
                {movie.name} <span className="text-[#9AA5B8] font-medium">({movie.year})</span>
              </h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-[#4F5C72]">
                {movie.language && <div className="flex items-center gap-2"><Globe size={16} className="text-[#9AA5B8]" />{movie.language}</div>}
                {movie.country && <div className="flex items-center gap-2"><MapPin size={16} className="text-[#9AA5B8]" />{movie.country}</div>}
                {movie.runtime && <div className="flex items-center gap-2"><Clock size={16} className="text-[#9AA5B8]" />{movie.runtime} mins</div>}
              </div>
            </div>
            <div className="flex items-center gap-3 py-4 border-y border-[#E0E8EF]">
              <Avatar className="h-10 w-10 border-2 border-[#EDF1F7]">
                <AvatarImage src={movie.director?.image_url} />
                <AvatarFallback className="bg-[#9A62FA] text-white font-bold">
                  {movie.director?.first_name?.[0] ?? "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-[10px] font-bold text-[#9AA5B8] uppercase tracking-wider">Director</p>
                <p className="text-sm font-bold text-[#1C2238]">{movie.director?.full_name ?? "Unknown"}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <DiskBadge name={movie.disk?.name} />
              {movie.tmdb_id && <TMDbBadge />}
              {movie.qualities?.map((q) => (
                <div key={q.id} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF1F7] text-[#4F5C72] text-[11px] font-bold border border-[#E0E8EF]">
                  <Star size={10} />{q.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-transparent border-b border-[#E0E8EF] w-full justify-start rounded-none h-12 p-0 gap-8">
          {[
            { value: "overview", label: "Overview" },
            { value: "cast-crew", label: "Cast & Crew" },
            { value: "ratings", label: "Ratings" },
            { value: "file-info", label: "File Info" },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#4299EB] data-[state=active]:bg-transparent data-[state=active]:text-[#4299EB] data-[state=active]:shadow-none px-1 h-full text-sm font-bold text-[#8892B0]"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-8">
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-[#1C2238]">Plot Summary</h3>
                {editingField !== "description" && (
                  <Button variant="ghost" size="sm" className="text-[#4299EB] font-bold text-xs"
                    onClick={() => startEditField("description", movie.description ?? "")}>
                    <Edit2 size={13} className="mr-1" /> Edit
                  </Button>
                )}
              </div>
              {editingField === "description" ? (
                <div className="space-y-3">
                  <textarea
                    className="w-full p-4 bg-[#EDF1F7] rounded-xl text-[#4F5C72] leading-relaxed font-medium min-h-[120px] outline-none focus:ring-2 focus:ring-[#4299EB] text-sm"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => saveField("description")} disabled={savingField}
                      className="h-9 bg-[#4299EB] text-white font-bold text-sm px-5">
                      {savingField ? <Loader2 size={13} className="animate-spin mr-1" /> : null} Save
                    </Button>
                    <Button variant="ghost" onClick={() => setEditingField(null)}
                      className="h-9 bg-[#EDF1F7] text-[#4F5C72] font-bold text-sm px-4">Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-[#EDF1F7] rounded-xl text-[#4F5C72] leading-relaxed font-medium">
                  {movie.description || "No description available."}
                </div>
              )}
            </div>

            {/* Story */}
            {(movie.story || editingField === "story") && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-[#1C2238]">The Story</h3>
                  {editingField !== "story" && (
                    <Button variant="ghost" size="sm" className="text-[#4299EB] font-bold text-xs"
                      onClick={() => startEditField("story", movie.story ?? "")}>
                      <Edit2 size={13} className="mr-1" /> Edit
                    </Button>
                  )}
                </div>
                {editingField === "story" ? (
                  <div className="space-y-3">
                    <textarea
                      className="w-full p-4 bg-[#EDF1F7] rounded-xl text-[#4F5C72] leading-relaxed font-medium min-h-[160px] outline-none focus:ring-2 focus:ring-[#4299EB] text-sm"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button onClick={() => saveField("story")} disabled={savingField}
                        className="h-9 bg-[#4299EB] text-white font-bold text-sm px-5">Save</Button>
                      <Button variant="ghost" onClick={() => setEditingField(null)}
                        className="h-9 bg-[#EDF1F7] text-[#4F5C72] font-bold text-sm px-4">Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[#4F5C72] leading-relaxed whitespace-pre-wrap">{movie.story}</p>
                )}
              </div>
            )}

            {movie.tagline && (
              <div className="py-6 border-y border-[#E0E8EF] text-center italic text-[#9A62FA] font-serif text-xl">
                &ldquo;{movie.tagline}&rdquo;
              </div>
            )}
          </TabsContent>

          {/* Cast & Crew Tab */}
          <TabsContent value="cast-crew" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#1C2238]">Actors ({movie.actors?.length ?? 0})</h3>
              <ActorSearch
                currentActorIds={movie.actors?.map((a) => a.id) ?? []}
                onAdd={handleAddActor}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movie.actors?.map((actor) => (
                <div key={actor.id} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#E0E8EF] group relative">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={actor.image_url} />
                    <AvatarFallback className="bg-[#4299EB]/10 text-[#4299EB] font-bold text-xs">
                      {actor.first_name?.[0]}{actor.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#1C2238] truncate">{actor.full_name}</p>
                    <p className="text-[10px] text-[#9AA5B8] font-bold uppercase tracking-wider">{actor.nationality || "Actor"}</p>
                  </div>
                  <ConfirmDialog
                    title={`Remove ${actor.full_name}?`}
                    description="This will unlink the actor from this movie."
                    confirmLabel="Remove"
                    variant="destructive"
                    onConfirm={() => handleRemoveActor(actor.id)}
                  >
                    <button className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#F25959] text-white items-center justify-center hidden group-hover:flex shadow-sm">
                      <X size={12} />
                    </button>
                  </ConfirmDialog>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Ratings Tab */}
          <TabsContent value="ratings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#1C2238]">External Ratings</h3>
              {!showRatingForm && (
                <Button variant="ghost" className="text-[#4299EB] font-bold text-sm"
                  onClick={() => { setShowRatingForm(true); setEditingRating(null); }}>
                  <Plus size={14} className="mr-1" /> Add Rating
                </Button>
              )}
            </div>

            {(showRatingForm && !editingRating) && (
              <RatingForm
                movieId={movieId}
                onSuccess={() => { setShowRatingForm(false); refetchRatings(); }}
                onCancel={() => setShowRatingForm(false)}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(ratings ?? movie.ratings)?.map((rating) => (
                <div key={rating.id}>
                  {editingRating?.id === rating.id ? (
                    <RatingForm
                      movieId={movieId}
                      existingRating={rating}
                      onSuccess={() => { setEditingRating(null); refetchRatings(); }}
                      onCancel={() => setEditingRating(null)}
                    />
                  ) : (
                    <Card className="p-6 border-none shadow-sm flex items-center justify-between group relative">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-[#1C2238]">{rating.reviewer?.name}</p>
                          {rating.reviewer?.website_url && (
                            <Link href={rating.reviewer.website_url} target="_blank">
                              <ExternalLink size={14} className="text-[#9AA5B8] hover:text-[#4299EB]" />
                            </Link>
                          )}
                        </div>
                        <p className="text-[10px] font-bold text-[#9AA5B8] uppercase tracking-wider">Reviewer</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#4299EB]">
                          {rating.rating_value}{" "}
                          <span className="text-[#9AA5B8] text-sm">/ {rating.rating_out_of}</span>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button
                          onClick={() => { setEditingRating(rating); setShowRatingForm(false); }}
                          className="w-7 h-7 rounded-full bg-[#EDF1F7] text-[#46BB78] hover:bg-[#46BB78] hover:text-white flex items-center justify-center"
                        >
                          <Edit2 size={12} />
                        </button>
                        <ConfirmDialog
                          title="Delete rating?"
                          description="This cannot be undone."
                          confirmLabel="Delete"
                          variant="destructive"
                          onConfirm={() => handleDeleteRating(rating.id)}
                        >
                          <button className="w-7 h-7 rounded-full bg-[#EDF1F7] text-[#F25959] hover:bg-[#F25959] hover:text-white flex items-center justify-center">
                            <Trash2 size={12} />
                          </button>
                        </ConfirmDialog>
                      </div>
                    </Card>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          {/* File Info Tab */}
          <TabsContent value="file-info">
            <FileInfoTab movie={movie} movieId={movieId} onSaved={invalidateMovie} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

// ── File Info Tab ──────────────────────────────────────────────────────────
function FileInfoTab({
  movie,
  movieId,
  onSaved,
}: {
  movie: import("@/types").MovieDetail;
  movieId: number;
  onSaved: () => void;
}) {
  const [fileSize, setFileSize] = useState(movie.file_size?.toString() ?? "");
  const [version, setVersion] = useState(movie.version ?? "");
  const [posterUrl, setPosterUrl] = useState(movie.poster_url ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.movies.update(movieId, {
        file_size: fileSize || undefined,
        version: version || undefined,
        poster_url: posterUrl || undefined,
      });
      toast.success("File info saved");
      onSaved();
    } catch (err) {
      toast.error(extractApiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl bg-white p-8 rounded-xl border border-[#E0E8EF] shadow-sm space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-[#4F5C72] uppercase tracking-wider block">File Size (MB)</label>
          <Input value={fileSize} onChange={(e) => setFileSize(e.target.value)}
            placeholder="1456" className="h-11 bg-[#EDF1F7] border-none rounded-xl" />
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-[#4F5C72] uppercase tracking-wider block">Version</label>
          <Input value={version} onChange={(e) => setVersion(e.target.value)}
            placeholder="Director's Cut" className="h-11 bg-[#EDF1F7] border-none rounded-xl" />
        </div>
        <div className="col-span-2 space-y-2">
          <label className="text-[11px] font-bold text-[#4F5C72] uppercase tracking-wider block">Poster URL</label>
          <Input value={posterUrl} onChange={(e) => setPosterUrl(e.target.value)}
            placeholder="https://..." className="h-11 bg-[#EDF1F7] border-none rounded-xl" />
          {posterUrl && (
            <div className="w-24 aspect-[2/3] rounded-lg overflow-hidden mt-2">
              <PosterImage src={posterUrl} alt="Preview" className="w-full h-full" />
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#E0E8EF]">
        <div>
          <label className="text-[10px] font-bold text-[#9AA5B8] uppercase tracking-wider mb-1 block">Assigned Disk</label>
          <DiskBadge name={movie.disk?.name} />
        </div>
        <div>
          <label className="text-[10px] font-bold text-[#9AA5B8] uppercase tracking-wider mb-1 block">Storage Type</label>
          <p className="font-bold text-[#1C2238]">{movie.disk?.storage_type || "N/A"}</p>
        </div>
      </div>
      <Button onClick={handleSave} disabled={saving}
        className="bg-[#4299EB] hover:bg-[#3182CE] text-white font-bold px-8 h-12 rounded-lg">
        {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
        Save File Info
      </Button>
    </div>
  );
}
