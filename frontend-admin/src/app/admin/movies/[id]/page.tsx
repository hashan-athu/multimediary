"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Edit2, 
  Trash2, 
  Film, 
  Clock, 
  Globe, 
  MapPin, 
  Star, 
  Info, 
  Users, 
  HardDrive,
  ExternalLink
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PosterImage from "@/components/shared/PosterImage";
import { DiskBadge, TMDbBadge, QualityBadge } from "@/components/shared/Badges";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function MovieDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const { data: movie, isLoading } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => apiClient.movies.get(Number(id)),
  });

  if (isLoading) return <div>Loading...</div>;
  if (!movie) return <div>Movie not found</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Breadcrumb & Top Actions */}
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
          <Button variant="ghost" className="bg-[#EDF1F7] text-[#46BB78] font-bold border border-[#46BB78]/20 h-10 px-6">
            <Edit2 size={16} className="mr-2" /> Edit Movie
          </Button>
          <Button variant="ghost" className="bg-[#F25959]/10 text-[#F25959] font-bold border border-[#F25959]/20 h-10 px-6">
            <Trash2 size={16} className="mr-2" /> Delete
          </Button>
        </div>
      </div>

      {/* Hero Header Card */}
      <Card className="p-8 border-none shadow-sm bg-white overflow-hidden relative">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4299EB] opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>

        <div className="flex flex-col md:flex-row gap-8 relative z-10">
          <div className="w-48 aspect-[2/3] shrink-0">
            <PosterImage src={movie.poster_url} alt={movie.name} className="w-full h-full shadow-lg" />
          </div>

          <div className="flex-1 space-y-6">
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((genre) => (
                <span key={genre.id} className="px-3 py-1 rounded-full bg-[#4299EB]/10 text-[#4299EB] text-xs font-bold border border-[#4299EB]/20">
                  {genre.name}
                </span>
              ))}
            </div>

            <div>
              <h1 className="text-4xl font-bold text-[#1C2238] tracking-tight mb-2">
                {movie.name} <span className="text-[#9AA5B8] font-medium">({movie.year})</span>
              </h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-[#4F5C72]">
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-[#9AA5B8]" /> {movie.language}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#9AA5B8]" /> {movie.country}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-[#9AA5B8]" /> {movie.runtime} mins
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 py-4 border-y border-[#E0E8EF]">
              <Avatar className="h-10 w-10 border-2 border-[#EDF1F7]">
                <AvatarImage src={movie.director?.image_url} />
                <AvatarFallback className="bg-[#9A62FA] text-white font-bold">
                  {movie.director?.first_name?.[0] || "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-[10px] font-bold text-[#9AA5B8] uppercase tracking-wider">Director</p>
                <p className="text-sm font-bold text-[#1C2238]">{movie.director?.full_name || "Unknown"}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <DiskBadge name={movie.disk?.name} />
              {movie.tmdb_id && <TMDbBadge />}
              {movie.qualities?.map(q => (
                 <div key={q.id} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF1F7] text-[#4F5C72] text-[11px] font-bold border border-[#E0E8EF]">
                    {q.name}
                 </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-transparent border-b border-[#E0E8EF] w-full justify-start rounded-none h-12 p-0 gap-8">
          {["Overview", "Cast & Crew", "Ratings", "File Info"].map((tab) => (
            <TabsTrigger 
              key={tab} 
              value={tab.toLowerCase().replace(" & ", "-")}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#4299EB] data-[state=active]:bg-transparent data-[state=active]:text-[#4299EB] data-[state=active]:shadow-none px-1 h-full text-sm font-bold text-[#8892B0]"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-8">
          <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <h3 className="text-lg font-bold text-[#1C2238] mb-4">Plot Summary</h3>
              <div className="p-6 bg-[#EDF1F7] rounded-xl text-[#4F5C72] leading-relaxed font-medium">
                {movie.description || "No description available."}
              </div>
            </div>
            {movie.story && (
              <div>
                <h3 className="text-lg font-bold text-[#1C2238] mb-4">The Story</h3>
                <p className="text-[#4F5C72] leading-relaxed whitespace-pre-wrap">{movie.story}</p>
              </div>
            )}
            {movie.tagline && (
              <div className="py-6 border-y border-[#E0E8EF] text-center italic text-[#9A62FA] font-serif text-xl">
                &ldquo;{movie.tagline}&rdquo;
              </div>
            )}
          </TabsContent>

          <TabsContent value="cast-crew" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#1C2238]">Actors</h3>
              <Button variant="ghost" className="text-[#4299EB] font-bold">+ Add Actor</Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {movie.actors?.map((actor) => (
                <div key={actor.id} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#E0E8EF] group relative">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={actor.image_url} />
                    <AvatarFallback className="bg-[#4299EB]/10 text-[#4299EB] font-bold">
                      {actor.first_name?.[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#1C2238] truncate">{actor.full_name}</p>
                    <p className="text-[10px] text-[#9AA5B8] font-bold uppercase tracking-wider">{actor.nationality || "Actor"}</p>
                  </div>
                  <button className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#F25959] text-white items-center justify-center hidden group-hover:flex shadow-sm">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ratings" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#1C2238]">External Ratings</h3>
              <Button variant="ghost" className="text-[#4299EB] font-bold">+ Add Rating</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {movie.ratings?.map((rating) => (
                <Card key={rating.id} className="p-6 border-none shadow-sm flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-[#1C2238]">{rating.reviewer.name}</p>
                      {rating.reviewer.website_url && (
                        <Link href={rating.reviewer.website_url} target="_blank">
                          <ExternalLink size={14} className="text-[#9AA5B8] hover:text-[#4299EB]" />
                        </Link>
                      )}
                    </div>
                    <p className="text-[10px] font-bold text-[#9AA5B8] uppercase tracking-wider">Reviewer</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#4299EB]">
                      {rating.rating_value} <span className="text-[#9AA5B8] text-sm">/ {rating.rating_out_of}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="file-info" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="max-w-2xl bg-white p-8 rounded-xl border border-[#E0E8EF] shadow-sm space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] font-bold text-[#9AA5B8] uppercase tracking-wider mb-2 block">File Size</label>
                  <p className="text-lg font-bold text-[#1C2238]">{movie.file_size} MB</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#9AA5B8] uppercase tracking-wider mb-2 block">Version</label>
                  <p className="text-lg font-bold text-[#1C2238]">{movie.version || "Standard"}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#9AA5B8] uppercase tracking-wider mb-2 block">Assigned Disk</label>
                  <DiskBadge name={movie.disk?.name} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#9AA5B8] uppercase tracking-wider mb-2 block">Storage Type</label>
                  <p className="text-lg font-bold text-[#1C2238]">{movie.disk?.storage_type || "N/A"}</p>
                </div>
              </div>
              
              <div className="pt-8 border-t border-[#E0E8EF]">
                <Button className="bg-[#4299EB] hover:bg-[#3182CE] text-white font-bold px-8 h-12 rounded-lg">
                  Edit File Metadata
                </Button>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
