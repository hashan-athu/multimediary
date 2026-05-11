"use client";

import { Film, ChevronRight } from "lucide-react";
import Link from "next/link";
import { UnifiedMovieForm } from "@/components/movies/UnifiedMovieForm";

export default function NewMoviePage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      <div className="flex items-center gap-2 text-sm text-[#9AA5B8]">
        <Link href="/admin/movies" className="hover:text-[#4299EB] transition-colors">
          Movies
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-[#1C2238] font-medium">Add Movie</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] flex items-center justify-center">
          <Film className="h-5 w-5 text-[#4299EB]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#1C2238]">Add Movie</h1>
          <p className="text-sm text-[#9AA5B8]">
            Fill in the details manually or use the TMDb panel above to pre-fill fields
          </p>
        </div>
      </div>

      <UnifiedMovieForm mode="create" />
    </div>
  );
}
