"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Search, Film } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import type { MovieList } from "@/types";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const { data } = useQuery({
    queryKey: ["global-search", debouncedQuery],
    queryFn: () =>
      apiClient.movies.list({
        "q[name_cont]": debouncedQuery || undefined,
        per_page: 8,
      }),
    enabled: debouncedQuery.length > 0,
    staleTime: 10_000,
  });

  const results: MovieList[] = data?.movies ?? [];

  const handleSelect = (movieId: number) => {
    setOpen(false);
    setQuery("");
    router.push(`/admin/movies/${movieId}`);
  };

  return (
    <>
      <Button
        variant="ghost"
        className="hidden md:flex items-center gap-2 h-9 px-3 bg-[#EDF1F7] text-[#9AA5B8] text-sm rounded-lg hover:bg-[#E0E8EF] font-normal w-56 justify-between"
        onClick={() => setOpen(true)}
      >
        <span className="flex items-center gap-2">
          <Search size={14} />
          Search…
        </span>
        <kbd className="text-[10px] bg-white border border-[#E0E8EF] rounded px-1.5 py-0.5 font-mono text-[#9AA5B8]">
          ⌘K
        </kbd>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="md:hidden text-[#4F5C72]"
        onClick={() => setOpen(true)}
      >
        <Search size={18} />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen} title="Search" description="Search movies in your library">
        <CommandInput
          placeholder="Search movies…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {debouncedQuery.length === 0 ? (
            <CommandEmpty>Start typing to search movies…</CommandEmpty>
          ) : results.length === 0 ? (
            <CommandEmpty>No movies found for &ldquo;{debouncedQuery}&rdquo;</CommandEmpty>
          ) : (
            <CommandGroup heading="Movies">
              {results.map((movie) => (
                <CommandItem
                  key={movie.id}
                  value={movie.name}
                  onSelect={() => handleSelect(movie.id)}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <Film size={14} className="text-[#4299EB] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-[#1C2238]">{movie.name}</span>
                    {movie.year && (
                      <span className="ml-2 text-xs text-[#9AA5B8]">{movie.year}</span>
                    )}
                  </div>
                  {movie.category && (
                    <span className="text-[10px] bg-[#EDF1F7] text-[#4F5C72] px-2 py-0.5 rounded font-bold uppercase tracking-wider flex-shrink-0">
                      {movie.category.name}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
