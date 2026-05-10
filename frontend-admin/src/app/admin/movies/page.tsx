"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, LayoutGrid, List, MoreVertical, Edit2, Eye, Trash2 } from "lucide-react";
import { apiClient, extractApiError } from "@/lib/api";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import PosterImage from "@/components/shared/PosterImage";
import { QualityBadge, DiskBadge } from "@/components/shared/Badges";
import { DataTable, SortableHeader } from "@/components/shared/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { MovieList } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const filterSelectCls =
  "h-10 bg-[#EDF1F7] text-[#4F5C72] font-semibold text-xs rounded-lg pl-3 pr-8 border-none outline-none appearance-none cursor-pointer";

export default function MoviesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [qualityFilter, setQualityFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [movieToDelete, setMovieToDelete] = useState<MovieList | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["movies", page, search, categoryFilter, genreFilter, qualityFilter, yearFilter],
    queryFn: () =>
      apiClient.movies.list({
        page,
        "q[name_cont]": search || undefined,
        "q[category_id_eq]": categoryFilter || undefined,
        "q[genres_id_eq]": genreFilter || undefined,
        "q[qualities_id_eq]": qualityFilter || undefined,
        "q[year_eq]": yearFilter || undefined,
      }),
  });

  const { data: catData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => apiClient.categories.list(),
  });

  const { data: genreData } = useQuery({
    queryKey: ["genres"],
    queryFn: () => apiClient.genres.list(),
  });

  const { data: qualityData } = useQuery({
    queryKey: ["qualities"],
    queryFn: () => apiClient.qualities.list(),
  });

  const handleDelete = async (id: number, name: string) => {
    try {
      await apiClient.movies.delete(id);
      toast.success(`"${name}" deleted`);
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    } catch (err) {
      toast.error(extractApiError(err));
    }
  };

  const resetFilters = () => {
    setCategoryFilter("");
    setGenreFilter("");
    setQualityFilter("");
    setYearFilter("");
    setSearch("");
    setPage(1);
  };

  const hasActiveFilters = !!(categoryFilter || genreFilter || qualityFilter || yearFilter || search);

  const columns: ColumnDef<MovieList>[] = [
    {
      accessorKey: "poster_url",
      header: "Poster",
      cell: ({ row }) => (
        <div className="w-10 h-14 relative rounded-md overflow-hidden bg-[#C8D0DC]">
          <PosterImage src={row.original.poster_url} alt={row.original.name} className="w-full h-full" />
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column} title="Name" />,
      cell: ({ row }) => <span className="font-bold">{row.original.name}</span>,
    },
    { accessorKey: "year", header: "Year" },
    {
      accessorKey: "category.name",
      header: "Category",
      cell: ({ row }) => (
        <span className="px-2 py-0.5 rounded bg-[#EDF1F7] text-[#4F5C72] text-[10px] font-bold uppercase tracking-wider">
          {row.original.category?.name}
        </span>
      ),
    },
    {
      accessorKey: "disk",
      header: "Disk",
      cell: ({ row }) => <DiskBadge name={row.original.disk?.name} />,
    },
    {
      accessorKey: "qualities",
      header: "Quality",
      cell: ({ row }) =>
        row.original.qualities?.[0] && <QualityBadge quality={row.original.qualities[0].name} />,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md text-[#9AA5B8] hover:bg-accent">
              <MoreVertical size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-xl border-[#E0E8EF] shadow-xl">
              <DropdownMenuItem className="gap-2 cursor-pointer py-2 font-medium">
                <Link href={`/admin/movies/${row.original.id}`} className="flex items-center gap-2 w-full">
                  <Eye size={14} className="text-[#4299EB]" /> View Detail
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer py-2 font-medium">
                <Link href={`/admin/movies/${row.original.id}`} className="flex items-center gap-2 w-full">
                  <Edit2 size={14} className="text-[#46BB78]" /> Edit Movie
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 cursor-pointer py-2 font-medium text-[#F25959]"
                onClick={() => setMovieToDelete(row.original)}
              >
                <Trash2 size={14} /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Movies"
        subtitle={`${data?.meta?.total_count ?? 0} movies in your library`}
        actions={
          <Link href="/admin/movies/new">
            <Button className="bg-[#4299EB] hover:bg-[#3182CE] text-white font-bold h-10 px-6 rounded-lg shadow-sm">
              <Plus size={18} className="mr-2" /> Add Movie
            </Button>
          </Link>
        }
      />

      {/* Filter & View Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E0E8EF] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA5B8]" size={16} />
            <Input
              placeholder="Search by name..."
              className="pl-10 bg-[#EDF1F7] border-none h-10 rounded-lg text-sm"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
              className={filterSelectCls}
            >
              <option value="">All Categories</option>
              {catData?.categories?.map((c) => (
                <option key={c.id} value={String(c.id)}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <select
              value={genreFilter}
              onChange={(e) => { setGenreFilter(e.target.value); setPage(1); }}
              className={filterSelectCls}
            >
              <option value="">All Genres</option>
              {genreData?.genres?.map((g) => (
                <option key={g.id} value={String(g.id)}>{g.name}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <select
              value={qualityFilter}
              onChange={(e) => { setQualityFilter(e.target.value); setPage(1); }}
              className={filterSelectCls}
            >
              <option value="">All Qualities</option>
              {qualityData?.qualities?.map((q) => (
                <option key={q.id} value={String(q.id)}>{q.name}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Input
              placeholder="Year"
              value={yearFilter}
              onChange={(e) => { setYearFilter(e.target.value); setPage(1); }}
              className="w-20 h-10 bg-[#EDF1F7] border-none rounded-lg text-xs font-semibold text-center text-[#4F5C72]"
              maxLength={4}
            />
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="h-10 text-xs font-semibold text-[#F25959] hover:bg-[#FFF0F0] px-3"
            >
              Clear filters
            </Button>
          )}
        </div>

        <div className="flex items-center gap-1 bg-[#EDF1F7] p-1 rounded-lg">
          {(["grid", "list"] as const).map((mode) => (
            <Button
              key={mode}
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-3 rounded-md font-bold text-[10px] uppercase tracking-wider transition-all",
                viewMode === mode ? "bg-white text-[#4299EB] shadow-sm" : "text-[#8892B0]"
              )}
              onClick={() => setViewMode(mode)}
            >
              {mode === "grid" ? <LayoutGrid size={14} className="mr-1.5" /> : <List size={14} className="mr-1.5" />}
              {mode}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[2/3] w-full bg-[#EDF1F7] animate-pulse rounded-xl" />
              <div className="h-4 w-3/4 bg-[#EDF1F7] animate-pulse rounded" />
              <div className="h-3 w-1/2 bg-[#EDF1F7] animate-pulse rounded" />
            </div>
          ))}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {data?.movies?.map((movie) => (
            <div key={movie.id} className="group relative">
              <Link href={`/admin/movies/${movie.id}`}>
                <div className="relative aspect-[2/3] mb-3 overflow-hidden rounded-xl bg-[#C8D0DC] shadow-sm group-hover:shadow-md transition-all group-hover:scale-[1.02]">
                  <PosterImage src={movie.poster_url} alt={movie.name} className="w-full h-full" />
                  <div className="absolute bottom-2 left-2">
                    {movie.qualities?.[0] && <QualityBadge quality={movie.qualities[0].name} />}
                  </div>
                  {movie.disk && (
                    <div className="absolute bottom-2 right-2">
                      <DiskBadge name={movie.disk.name} />
                    </div>
                  )}
                </div>
                <h4 className="font-bold text-sm text-[#1C2238] truncate group-hover:text-[#4299EB] transition-colors">
                  {movie.name}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-[#4F5C72] font-medium mt-1">
                  <span>{movie.year}</span>
                  {movie.language && <><span>•</span><span>{movie.language}</span></>}
                </div>
              </Link>
              {/* Quick delete on hover */}
              <div
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#F25959] text-white items-center justify-center hidden group-hover:flex shadow-sm z-10 cursor-pointer"
                onClick={() => setMovieToDelete(movie)}
              >
                <Trash2 size={13} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DataTable columns={columns} data={data?.movies || []} isLoading={isLoading} />
      )}

      {/* Pagination */}
      {!isLoading && data?.meta && data.meta.total_pages > 1 && (
        <div className="flex items-center justify-center pt-8 gap-2">
          <Button
            variant="ghost"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="bg-white border border-[#E0E8EF] text-[#4F5C72] font-bold text-xs px-4"
          >
            Previous
          </Button>
          <div className="flex items-center gap-1 px-4">
            {Array.from({ length: Math.min(5, data.meta.total_pages) }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={i}
                  variant={page === pageNum ? "default" : "ghost"}
                  onClick={() => setPage(pageNum)}
                  className={cn(
                    "w-10 h-10 p-0 rounded-lg font-bold text-xs",
                    page === pageNum ? "bg-[#4299EB] text-white" : "text-[#4F5C72] bg-white"
                  )}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          <Button
            variant="ghost"
            disabled={page === data.meta.total_pages}
            onClick={() => setPage((p) => p + 1)}
            className="bg-white border border-[#E0E8EF] text-[#4F5C72] font-bold text-xs px-4"
          >
            Next
          </Button>
        </div>
      )}

      <ConfirmDialog
        title={movieToDelete ? `Delete "${movieToDelete.name}"?` : "Delete movie?"}
        description="This cannot be undone. The movie will be permanently removed from your library."
        confirmLabel="Delete Movie"
        variant="destructive"
        open={movieToDelete !== null}
        onOpenChange={(open) => { if (!open) setMovieToDelete(null); }}
        onConfirm={() => { if (movieToDelete) handleDelete(movieToDelete.id, movieToDelete.name); }}
      />
    </div>
  );
}
