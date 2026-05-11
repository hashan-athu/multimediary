"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { apiClient, extractApiError } from "@/lib/adminApi";
import { ImageUploadField } from "@/components/shared/ImageUploadField";
import { CastSelector } from "@/components/movies/CastSelector";
import { TMDbEnrichmentPanel } from "@/components/movies/TMDbEnrichmentPanel";
import { FormField } from "@/components/movies/FormField";
import { DirectorSelector } from "@/components/movies/DirectorSelector";
import type { MovieDetail, Category, Genre, Quality, Disk } from "@/types";

// ── Schema ────────────────────────────────────────────────────────────────────

const THIS_YEAR = new Date().getFullYear();

const movieSchema = z.object({
  name:        z.string().min(1, "Title is required"),
  year:        z.number().int().min(1888).max(THIS_YEAR + 2).nullable().optional(),
  runtime:     z.number().int().positive().nullable().optional(),
  language:    z.string().optional().nullable(),
  country:     z.string().optional().nullable(),
  tagline:     z.string().optional().nullable(),
  file_size:   z.string().optional().nullable(),
  version:     z.string().optional().nullable(),
  poster_url:  z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  story:       z.string().optional().nullable(),
  tmdb_id:     z.number().optional().nullable(),
  category_id: z.number().min(1, "Category is required"),
  disk_id:     z.number().optional().nullable(),
  director_id: z.number().optional().nullable(),
  actor_ids:   z.array(z.number()),
  genre_ids:   z.array(z.number()),
  quality_ids: z.array(z.number()),
});

type MovieFormData = z.infer<typeof movieSchema>;

// ── Props ─────────────────────────────────────────────────────────────────────

interface UnifiedMovieFormProps {
  mode: "create" | "edit";
  initialData?: MovieDetail | null;
  onSuccess?: (movieId: number) => void;
}

// ── Shared class strings ──────────────────────────────────────────────────────

const inputCls =
  "w-full px-3 py-2.5 rounded-lg bg-[#EDF1F7] text-sm text-[#1C2238] placeholder:text-[#9AA5B8] outline-none focus:ring-2 focus:ring-[#4299EB] focus:bg-white transition-colors";

const selectCls =
  "w-full px-3 py-2.5 rounded-lg bg-[#EDF1F7] text-sm text-[#1C2238] outline-none focus:ring-2 focus:ring-[#4299EB] focus:bg-white transition-colors appearance-none cursor-pointer";

// ── Section wrapper ───────────────────────────────────────────────────────────

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#E0E8EF] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E0E8EF]">
        <h3 className="text-sm font-semibold text-[#1C2238]">{title}</h3>
        {description && <p className="text-xs text-[#9AA5B8] mt-0.5">{description}</p>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function UnifiedMovieForm({ mode, initialData, onSuccess }: UnifiedMovieFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<MovieFormData>({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      name:        initialData?.name        ?? "",
      year:        initialData?.year        ?? null,
      runtime:     initialData?.runtime != null ? Number(initialData.runtime) : null,
      language:    initialData?.language    ?? "",
      country:     initialData?.country     ?? "",
      tagline:     initialData?.tagline     ?? "",
      file_size:   String(initialData?.file_size  ?? ""),
      version:     initialData?.version     ?? "",
      poster_url:  initialData?.poster_url  ?? "",
      description: initialData?.description ?? "",
      story:       initialData?.story       ?? "",
      tmdb_id:     initialData?.tmdb_id     ?? null,
      category_id: initialData?.category?.id ?? 0,
      disk_id:     initialData?.disk?.id    ?? null,
      director_id: initialData?.director?.id ?? null,
      actor_ids:   initialData?.actors?.map((a) => a.id)   ?? [],
      genre_ids:   initialData?.genres?.map((g) => g.id)   ?? [],
      quality_ids: initialData?.qualities?.map((q) => q.id) ?? [],
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name:        initialData.name        ?? "",
        year:        initialData.year        ?? null,
        runtime:     initialData.runtime != null ? Number(initialData.runtime) : null,
        language:    initialData.language    ?? "",
        country:     initialData.country     ?? "",
        tagline:     initialData.tagline     ?? "",
        file_size:   String(initialData.file_size  ?? ""),
        version:     initialData.version     ?? "",
        poster_url:  initialData.poster_url  ?? "",
        description: initialData.description ?? "",
        story:       initialData.story       ?? "",
        tmdb_id:     initialData.tmdb_id     ?? null,
        category_id: initialData.category?.id ?? 0,
        disk_id:     initialData.disk?.id    ?? null,
        director_id: initialData.director?.id ?? null,
        actor_ids:   initialData.actors?.map((a) => a.id)   ?? [],
        genre_ids:   initialData.genres?.map((g) => g.id)   ?? [],
        quality_ids: initialData.qualities?.map((q) => q.id) ?? [],
      });
    }
  }, [initialData, form]);

  // ── Reference data ────────────────────────────────────────────────────────

  const { data: catData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => apiClient.categories.list(),
    staleTime: Infinity,
  });
  const { data: genreData } = useQuery({
    queryKey: ["genres"],
    queryFn: () => apiClient.genres.list(),
    staleTime: Infinity,
  });
  const { data: qualData } = useQuery({
    queryKey: ["qualities"],
    queryFn: () => apiClient.qualities.list(),
    staleTime: Infinity,
  });
  const { data: diskData } = useQuery({
    queryKey: ["disks"],
    queryFn: () => apiClient.disks.list({ per_page: 200 }),
    staleTime: 5 * 60 * 1000,
  });

  const categories: Category[] = catData?.categories   ?? [];
  const genres:     Genre[]    = genreData?.genres      ?? [];
  const qualities:  Quality[]  = qualData?.qualities    ?? [];
  const disks:      Disk[]     = diskData?.disks        ?? [];

  // ── Save mutation ─────────────────────────────────────────────────────────

  const saveMutation = useMutation({
    mutationFn: async (data: MovieFormData) => {
      const payload = {
        name:        data.name,
        year:        data.year        ?? undefined,
        runtime:     data.runtime     ?? undefined,
        language:    data.language    || undefined,
        country:     data.country     || undefined,
        tagline:     data.tagline     || undefined,
        file_size:   data.file_size   || undefined,
        version:     data.version     || undefined,
        poster_url:  data.poster_url  || undefined,
        description: data.description || undefined,
        story:       data.story       || undefined,
        tmdb_id:     data.tmdb_id     ?? undefined,
        category_id: data.category_id,
        disk_id:     data.disk_id     ?? undefined,
        director_id: data.director_id ?? undefined,
        actor_ids:   data.actor_ids,
        genre_ids:   data.genre_ids,
        quality_ids: data.quality_ids,
      };
      if (mode === "create") {
        return apiClient.movies.create(payload);
      } else {
        return apiClient.movies.update(initialData!.id, payload);
      }
    },
    onSuccess: (movie) => {
      toast.success(mode === "create" ? `"${movie.name}" added to library` : "Movie updated");
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      queryClient.invalidateQueries({ queryKey: ["movies", movie.id] });
      onSuccess?.(movie.id);
      if (mode === "create") {
        router.push(`/admin/movies/${movie.id}`);
      }
    },
    onError: (error: unknown) => {
      toast.error(extractApiError(error));
    },
  });

  const onSubmit = (data: MovieFormData) => saveMutation.mutate(data);

  // ── Helpers for genre / quality pills ───────────────────────────────────

  const toggleId = (field: "genre_ids" | "quality_ids", id: number) => {
    const current = form.getValues(field) ?? [];
    form.setValue(
      field,
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
      { shouldDirty: true }
    );
  };

  // ── Render ───────────────────────────────────────────────────────────────

  const genreIds   = form.watch("genre_ids")   ?? [];
  const qualityIds = form.watch("quality_ids") ?? [];
  const categoryId = form.watch("category_id");
  const diskId     = form.watch("disk_id");
  const directorId = form.watch("director_id");
  const actorIds   = form.watch("actor_ids")   ?? [];
  const posterUrl  = form.watch("poster_url")  ?? "";
  const tmdbId     = form.watch("tmdb_id");
  const yearVal    = form.watch("year");
  const runtimeVal = form.watch("runtime");

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

      {/* ── TMDb Enrichment ─────────────────────────────────────────────── */}
      <TMDbEnrichmentPanel
        currentTmdbId={tmdbId}
        onEnrich={(fields) => {
          Object.entries(fields).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              form.setValue(key as keyof MovieFormData, value as never, { shouldDirty: true });
            }
          });
          toast.success("Fields filled — review and save when ready");
        }}
      />

      {/* ── Basic Information ────────────────────────────────────────────── */}
      <FormSection title="Basic Information" description="Core details about the movie">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <FormField name="name" label="Movie Title *" form={form}>
              <input
                {...form.register("name")}
                placeholder="e.g. Inception"
                className={inputCls}
              />
            </FormField>
          </div>

          <FormField name="year" label="Year" form={form}>
            <input
              type="number"
              value={yearVal ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                form.setValue("year", v === "" ? null : parseInt(v, 10), { shouldDirty: true });
              }}
              placeholder={String(THIS_YEAR)}
              min={1888}
              max={THIS_YEAR + 2}
              className={inputCls}
            />
          </FormField>

          <FormField name="runtime" label="Runtime (minutes)" form={form}>
            <input
              type="number"
              value={runtimeVal ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                form.setValue("runtime", v === "" ? null : parseInt(v, 10), { shouldDirty: true });
              }}
              placeholder="e.g. 148"
              min={1}
              className={inputCls}
            />
          </FormField>

          <FormField name="language" label="Language" form={form}>
            <input {...form.register("language")} placeholder="e.g. English" className={inputCls} />
          </FormField>

          <FormField name="country" label="Country" form={form}>
            <input {...form.register("country")} placeholder="e.g. USA" className={inputCls} />
          </FormField>

          <div className="md:col-span-2">
            <FormField name="tagline" label="Tagline" form={form}>
              <input
                {...form.register("tagline")}
                placeholder='e.g. "Your mind is the scene of the crime."'
                className={inputCls}
              />
            </FormField>
          </div>
        </div>
      </FormSection>

      {/* ── Poster & File Info ───────────────────────────────────────────── */}
      <FormSection title="Poster & File Information" description="Poster image and physical file details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <ImageUploadField
              label="Movie Poster"
              value={posterUrl}
              onChange={(url) => form.setValue("poster_url", url, { shouldDirty: true })}
              aspectRatio="poster"
            />
          </div>

          <FormField name="file_size" label="File Size (MB)" form={form}>
            <input {...form.register("file_size")} placeholder="e.g. 1456" className={inputCls} />
          </FormField>

          <FormField name="version" label="Version / Cut" form={form}>
            <input
              {...form.register("version")}
              placeholder="e.g. Director's Cut, Extended"
              className={inputCls}
            />
          </FormField>
        </div>
      </FormSection>

      {/* ── Classification ───────────────────────────────────────────────── */}
      <FormSection title="Classification" description="Category, genres, quality and disk assignment">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <FormField name="category_id" label="Category *" form={form}>
            <select
              value={categoryId || ""}
              onChange={(e) =>
                form.setValue("category_id", e.target.value ? parseInt(e.target.value, 10) : 0, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              className={selectCls}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </FormField>

          <FormField name="disk_id" label="Disk" form={form}>
            <select
              value={diskId ?? ""}
              onChange={(e) =>
                form.setValue("disk_id", e.target.value ? parseInt(e.target.value, 10) : null, {
                  shouldDirty: true,
                })
              }
              className={selectCls}
            >
              <option value="">No disk assigned</option>
              {disks.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} — {d.disk_format?.name} ({d.storage_type})
                </option>
              ))}
            </select>
          </FormField>

          {/* Genres */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-[#4F5C72] mb-1.5">Genres</label>
            <div className="flex flex-wrap gap-2 p-3 bg-[#EDF1F7] rounded-lg min-h-[44px]">
              {genres.map((g) => {
                const checked = genreIds.includes(g.id);
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => toggleId("genre_ids", g.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors select-none ${
                      checked
                        ? "bg-[#4299EB] text-white"
                        : "bg-white text-[#4F5C72] border border-[#E0E8EF] hover:border-[#4299EB]"
                    }`}
                  >
                    {g.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Qualities */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-[#4F5C72] mb-1.5">Quality</label>
            <div className="flex flex-wrap gap-2 p-3 bg-[#EDF1F7] rounded-lg min-h-[44px]">
              {qualities.map((q) => {
                const checked = qualityIds.includes(q.id);
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => toggleId("quality_ids", q.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors select-none ${
                      checked
                        ? "bg-[#1C2238] text-white"
                        : "bg-white text-[#4F5C72] border border-[#E0E8EF] hover:border-[#1C2238]"
                    }`}
                  >
                    {q.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </FormSection>

      {/* ── Director & Cast ──────────────────────────────────────────────── */}
      <FormSection title="Director & Cast" description="Who made and starred in this movie">
        <div className="space-y-4">
          <DirectorSelector
            value={directorId ?? null}
            onChange={(id) => form.setValue("director_id", id, { shouldDirty: true })}
            initialDirector={initialData?.director ?? null}
          />
          <CastSelector
            selectedActorIds={actorIds}
            onChange={(ids) => form.setValue("actor_ids", ids, { shouldDirty: true })}
          />
        </div>
      </FormSection>

      {/* ── Plot & Story ─────────────────────────────────────────────────── */}
      <FormSection title="Plot & Story" description="Short plot summary and full synopsis">
        <div className="space-y-4">
          <FormField name="description" label="Short Plot Summary" form={form}>
            <textarea
              {...form.register("description")}
              rows={3}
              placeholder="A brief overview shown in search results and listings..."
              className={`${inputCls} resize-none`}
            />
          </FormField>
          <FormField name="story" label="Full Story / Synopsis" form={form}>
            <textarea
              {...form.register("story")}
              rows={6}
              placeholder="A detailed plot synopsis..."
              className={`${inputCls} resize-y`}
            />
          </FormField>
        </div>
      </FormSection>

      {/* ── Submit bar ───────────────────────────────────────────────────── */}
      <div className="sticky bottom-0 bg-white border-t border-[#E0E8EF] px-6 py-4 flex items-center justify-between gap-3 -mx-4 rounded-b-xl shadow-lg">
        <div className="text-xs text-[#9AA5B8]">
          {form.formState.isDirty ? "Unsaved changes" : "No changes"}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 rounded-lg bg-[#EDF1F7] text-[#4F5C72] text-sm font-medium hover:bg-[#E2E8F0] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="px-6 py-2 rounded-lg bg-[#4299EB] text-white text-sm font-semibold hover:bg-[#3182CE] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saveMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "create" ? "Add to Library" : "Save Changes"}
          </button>
        </div>
      </div>

    </form>
  );
}
