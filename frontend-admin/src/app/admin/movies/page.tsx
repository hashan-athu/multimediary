"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  List, 
  Filter,
  ChevronDown,
  MoreVertical,
  Edit2,
  Eye,
  Trash2
} from "lucide-react";
import { apiClient } from "@/lib/api";
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
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function MoviesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["movies", page, search],
    queryFn: () => apiClient.movies.list({ page, "q[name_cont]": search }),
  });

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
    {
      accessorKey: "year",
      header: "Year",
    },
    {
      accessorKey: "category.name",
      header: "Category",
      cell: ({ row }) => (
        <span className="px-2 py-0.5 rounded bg-[#EDF1F7] text-[#4F5C72] text-[10px] font-bold uppercase tracking-wider">
          {row.original.category.name}
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
      cell: ({ row }) => row.original.qualities?.[0] && <QualityBadge quality={row.original.qualities[0].name} />,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-[#9AA5B8]">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-xl border-[#E0E8EF] shadow-xl">
              <DropdownMenuItem className="gap-2 cursor-pointer py-2 font-medium">
                <Link href={`/admin/movies/${row.original.id}`}>
                  <Eye size={14} className="text-[#4299EB]" /> View Detail
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer py-2 font-medium">
                <Edit2 size={14} className="text-[#46BB78]" /> Edit Movie
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer py-2 font-medium text-[#F25959]">
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
        subtitle={`${data?.meta?.total_count || 0} movies in your library`}
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
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA5B8]" size={16} />
            <Input 
              placeholder="Search by name..." 
              className="pl-10 bg-[#EDF1F7] border-none h-10 rounded-lg text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            {["Category", "Genre", "Quality", "Format", "Year"].map((filter) => (
              <Button key={filter} variant="ghost" className="h-10 bg-[#EDF1F7] text-[#4F5C72] font-semibold text-xs rounded-lg px-4 flex items-center gap-2">
                {filter} <ChevronDown size={14} className="text-[#9AA5B8]" />
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1 bg-[#EDF1F7] p-1 rounded-lg">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "h-8 px-3 rounded-md font-bold text-[10px] uppercase tracking-wider transition-all",
              viewMode === "grid" ? "bg-white text-[#4299EB] shadow-sm" : "text-[#8892B0]"
            )}
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid size={14} className="mr-1.5" /> Grid
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "h-8 px-3 rounded-md font-bold text-[10px] uppercase tracking-wider transition-all",
              viewMode === "list" ? "bg-white text-[#4299EB] shadow-sm" : "text-[#8892B0]"
            )}
            onClick={() => setViewMode("list")}
          >
            <List size={14} className="mr-1.5" /> List
          </Button>
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
            <Link key={movie.id} href={`/admin/movies/${movie.id}`} className="group">
              <div className="relative aspect-[2/3] mb-3 overflow-hidden rounded-xl bg-[#C8D0DC] shadow-sm group-hover:shadow-md transition-all group-hover:scale-[1.02]">
                <PosterImage 
                  src={movie.poster_url} 
                  alt={movie.name} 
                  className="w-full h-full" 
                />
                
                {/* Overlay Badges */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
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
                <span>•</span>
                <span>{movie.language}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <DataTable columns={columns} data={data?.movies || []} isLoading={isLoading} />
      )}

      {/* Pagination - Simplified */}
      {!isLoading && data?.meta && (
        <div className="flex items-center justify-center pt-8">
          <div className="flex items-center gap-2">
             <Button 
               variant="ghost" 
               disabled={page === 1} 
               onClick={() => setPage(p => p - 1)}
               className="bg-white border border-[#E0E8EF] text-[#4F5C72] font-bold text-xs px-4"
             >
               Previous
             </Button>
             <div className="flex items-center gap-1 px-4">
               {Array.from({ length: Math.min(5, data.meta.total_pages) }).map((_, i) => (
                 <Button 
                   key={i} 
                   variant={page === i + 1 ? "default" : "ghost"}
                   onClick={() => setPage(i + 1)}
                   className={cn(
                     "w-10 h-10 p-0 rounded-lg font-bold text-xs",
                     page === i + 1 ? "bg-[#4299EB] text-white" : "text-[#4F5C72] bg-white"
                   )}
                 >
                   {i + 1}
                 </Button>
               ))}
             </div>
             <Button 
               variant="ghost" 
               disabled={page === data.meta.total_pages} 
               onClick={() => setPage(p => p + 1)}
               className="bg-white border border-[#E0E8EF] text-[#4F5C72] font-bold text-xs px-4"
             >
               Next
             </Button>
          </div>
        </div>
      )}
    </div>
  );
}
