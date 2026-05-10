"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Search, X, User } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import type { Director } from "@/types";

interface DirectorSelectorProps {
  value: number | null;
  onChange: (id: number | null) => void;
  initialDirector?: Director | null;
}

export function DirectorSelector({ value, onChange, initialDirector }: DirectorSelectorProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [dirCache, setDirCache] = useState<Record<number, string>>(() => {
    if (initialDirector) return { [initialDirector.id]: initialDirector.full_name };
    return {};
  });
  const debouncedQuery = useDebounce(query, 300);

  const { data } = useQuery({
    queryKey: ["directors-search", debouncedQuery],
    queryFn: () =>
      apiClient.directors.list({
        "q[first_name_or_last_name_cont]": debouncedQuery || undefined,
        per_page: 10,
      }),
    staleTime: 30_000,
  });

  const directors: Director[] = data?.directors ?? [];
  const selectedName = value ? dirCache[value] : null;

  const select = useCallback(
    (dir: Director) => {
      setDirCache((prev) => ({ ...prev, [dir.id]: dir.full_name }));
      onChange(dir.id);
      setQuery("");
      setOpen(false);
    },
    [onChange]
  );

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-[#4F5C72] mb-1.5">Director</label>

      {value && selectedName ? (
        <div className="flex items-center gap-3 px-3 py-2.5 bg-[#EDF1F7] rounded-lg">
          <div className="w-7 h-7 rounded-full bg-[#9A62FA]/10 flex items-center justify-center flex-shrink-0">
            <User className="h-3.5 w-3.5 text-[#9A62FA]" />
          </div>
          <span className="text-sm font-medium text-[#1C2238] flex-1">{selectedName}</span>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="p-1 rounded-md hover:bg-[#E0E8EF] text-[#9AA5B8] hover:text-[#F25959] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9AA5B8]" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder="Search directors…"
            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#EDF1F7] text-sm text-[#1C2238] placeholder:text-[#9AA5B8] outline-none focus:ring-2 focus:ring-[#4299EB]"
          />
          {open && directors.length > 0 && (
            <ul className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-[#E0E8EF] rounded-lg shadow-lg max-h-48 overflow-y-auto divide-y divide-[#E0E8EF]">
              {directors.map((dir) => (
                <li key={dir.id}>
                  <button
                    type="button"
                    onMouseDown={() => select(dir)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-[#EDF1F7] transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#9A62FA]/10 flex items-center justify-center text-xs font-medium text-[#9A62FA] flex-shrink-0">
                      {dir.first_name?.[0]}{dir.last_name?.[0]}
                    </div>
                    <span className="text-sm text-[#1C2238]">{dir.full_name}</span>
                    {dir.nationality && (
                      <span className="text-xs text-[#9AA5B8] ml-auto">{dir.nationality}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
