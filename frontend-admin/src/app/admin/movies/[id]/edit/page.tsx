"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { UnifiedMovieForm } from "@/components/movies/UnifiedMovieForm";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { MovieDetail } from "@/types";

export default function EditMoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const movieId = parseInt(id, 10);

  const { data: movie, isLoading, error } = useQuery<MovieDetail>({
    queryKey: ["movies", movieId],
    queryFn: () => apiClient.movies.get(movieId),
    enabled: !isNaN(movieId),
  });

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-5 w-48 bg-[#EDF1F7] rounded" />
        <div className="h-64 bg-[#EDF1F7] rounded-xl" />
        <div className="h-48 bg-[#EDF1F7] rounded-xl" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="text-center py-16 text-[#9AA5B8]">
        Movie not found.{" "}
        <Link href="/admin/movies" className="text-[#4299EB] hover:underline">
          Back to Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      <div className="flex items-center gap-2 text-sm text-[#9AA5B8]">
        <Link href="/admin/movies" className="hover:text-[#4299EB] transition-colors">
          Movies
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/admin/movies/${id}`} className="hover:text-[#4299EB] transition-colors truncate max-w-[200px]">
          {movie.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-[#1C2238] font-medium">Edit</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#1C2238]">Edit Movie</h1>
        <Link
          href={`/admin/movies/${id}`}
          className="text-sm text-[#9AA5B8] hover:text-[#4299EB] transition-colors"
        >
          ← Back to detail
        </Link>
      </div>

      <UnifiedMovieForm
        mode="edit"
        initialData={movie}
        onSuccess={(movieId) => router.push(`/admin/movies/${movieId}`)}
      />
    </div>
  );
}
