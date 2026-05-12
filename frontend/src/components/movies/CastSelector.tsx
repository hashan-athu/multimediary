"use client";

import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/adminApi";
import { X, Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import type { Actor } from "@/types";

interface CastSelectorProps {
  selectedActorIds: number[];
  onChange: (ids: number[]) => void;
  selectedActors?: Actor[];
}

export function CastSelector({ selectedActorIds, onChange, selectedActors = [] }: CastSelectorProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  // Local cache: id → name, built as actors are selected
  const [actorCache, setActorCache] = useState<Record<number, string>>({});
  const debouncedQuery = useDebounce(query, 300);
  const actorNames = useMemo<Record<number, string>>(
    () => ({
      ...Object.fromEntries(selectedActors.map((actor) => [actor.id, actor.full_name])),
      ...actorCache,
    }),
    [actorCache, selectedActors]
  );

  const { data: searchData } = useQuery({
    queryKey: ["actors-search", debouncedQuery],
    queryFn: () =>
      apiClient.actors.list({
        "q[first_name_or_last_name_cont]": debouncedQuery || undefined,
        per_page: 10,
      }),
    staleTime: 30_000,
  });

  const searchResults: Actor[] = searchData?.actors ?? [];

  const addActor = useCallback(
    (actor: Actor) => {
      if (!selectedActorIds.includes(actor.id)) {
        setActorCache((prev) => ({ ...prev, [actor.id]: actor.full_name }));
        onChange([...selectedActorIds, actor.id]);
      }
      setQuery("");
      setOpen(false);
    },
    [selectedActorIds, onChange]
  );

  const removeActor = useCallback(
    (id: number) => {
      onChange(selectedActorIds.filter((aid) => aid !== id));
    },
    [selectedActorIds, onChange]
  );

  return (
    <div className="space-y-2">
      <label className="text-[11px] font-bold text-[#4F5C72] uppercase tracking-wider">
        Cast / Actors
      </label>

      {selectedActorIds.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedActorIds.map((id) => (
            <span
              key={id}
              className="flex items-center gap-1.5 pl-2 pr-1 py-1 rounded-full bg-[#EEF4FF] text-[#4299EB] text-xs font-medium"
            >
              {actorNames[id] ?? `Actor #${id}`}
              <button
                type="button"
                onClick={() => removeActor(id)}
                className="hover:bg-[#4299EB] hover:text-white rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9AA5B8]" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search actors…"
          className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#EDF1F7] text-sm text-[#1C2238] placeholder:text-[#9AA5B8] outline-none focus:ring-2 focus:ring-[#4299EB]"
        />

        {open && searchResults.length > 0 && (
          <ul className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-[#E0E8EF] rounded-lg shadow-lg max-h-48 overflow-y-auto divide-y divide-[#E0E8EF]">
            {searchResults
              .filter((a) => !selectedActorIds.includes(a.id))
              .map((actor) => (
                <li key={actor.id}>
                  <button
                    type="button"
                    onMouseDown={() => addActor(actor)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-[#EDF1F7] transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#EDF1F7] flex items-center justify-center text-xs font-medium text-[#4F5C72] flex-shrink-0">
                      {actor.first_name?.[0]}{actor.last_name?.[0]}
                    </div>
                    <span className="text-sm text-[#1C2238]">{actor.full_name}</span>
                    {actor.nationality && (
                      <span className="text-xs text-[#9AA5B8] ml-auto">{actor.nationality}</span>
                    )}
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>

      {selectedActorIds.length === 0 && (
        <p className="text-xs text-[#9AA5B8]">
          Search and add actors. You can also add cast later from the movie detail page.
        </p>
      )}
    </div>
  );
}
