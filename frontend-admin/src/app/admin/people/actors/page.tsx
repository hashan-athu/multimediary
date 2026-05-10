"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  Plus, 
  Search, 
  Users, 
  MapPin, 
  Film,
  Edit2,
  Trash2,
  User
} from "lucide-react";
import { apiClient } from "@/lib/api";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function PeoplePage() {
  const pathname = usePathname();
  const isActors = pathname.includes("actors");
  
  const { data: people, isLoading } = useQuery({
    queryKey: [isActors ? "actors" : "directors"],
    queryFn: () => isActors ? apiClient.people.actors.list({}) : apiClient.people.directors.list({}),
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="People"
        subtitle={`Manage ${isActors ? "actors" : "directors"} in your library`}
        actions={
          <Button className="bg-[#4299EB] hover:bg-[#3182CE] text-white font-bold h-10 px-6 rounded-lg shadow-sm">
            <Plus size={18} className="mr-2" /> Add {isActors ? "Actor" : "Director"}
          </Button>
        }
      />

      {/* Sub-nav Tabs */}
      <div className="flex gap-2 p-1 bg-[#EDF1F7] rounded-xl w-fit">
        <Link href="/admin/people/actors">
          <Button 
            variant="ghost" 
            className={cn(
              "h-10 px-8 rounded-lg font-bold text-sm transition-all",
              isActors ? "bg-white text-[#4299EB] shadow-sm" : "text-[#8892B0]"
            )}
          >
            Actors
          </Button>
        </Link>
        <Link href="/admin/people/directors">
          <Button 
            variant="ghost" 
            className={cn(
              "h-10 px-8 rounded-lg font-bold text-sm transition-all",
              !isActors ? "bg-white text-[#4299EB] shadow-sm" : "text-[#8892B0]"
            )}
          >
            Directors
          </Button>
        </Link>
      </div>

      {/* Stats & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap gap-4">
           {[
             { label: "Total People", value: people?.length || 0 },
             { label: "Nationalities", value: 14 },
             { label: "Movie Coverage", value: "84%" },
           ].map((stat, i) => (
             <div key={i} className="flex flex-col">
               <span className="text-[10px] font-bold text-[#9AA5B8] uppercase tracking-wider">{stat.label}</span>
               <span className="text-lg font-bold text-[#1C2238]">{stat.value}</span>
             </div>
           ))}
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA5B8]" size={16} />
          <Input 
            placeholder={`Search ${isActors ? "actors" : "directors"}...`} 
            className="pl-10 bg-white border border-[#E0E8EF] h-11 rounded-xl text-sm"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-[#E0E8EF] shadow-sm flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-[#EDF1F7] animate-pulse" />
              <div className="h-4 w-3/4 bg-[#EDF1F7] animate-pulse rounded" />
              <div className="h-3 w-1/2 bg-[#EDF1F7] animate-pulse rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {Array.isArray(people) && people.map((person) => (
            <div key={person.id} className="group bg-white p-6 rounded-2xl border border-[#E0E8EF] shadow-sm hover:shadow-md transition-all hover:border-[#4299EB] relative flex flex-col items-center text-center">
              {/* Hover Actions */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full bg-[#EDF1F7] text-[#46BB78] hover:bg-[#46BB78] hover:text-white">
                  <Edit2 size={14} />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full bg-[#EDF1F7] text-[#F25959] hover:bg-[#F25959] hover:text-white">
                  <Trash2 size={14} />
                </Button>
              </div>

              <Avatar className="w-20 h-20 mb-4 border-4 border-[#F4F5F8] shadow-sm">
                <AvatarImage src={person.image_url} />
                <AvatarFallback className="bg-[#4299EB]/10 text-[#4299EB] font-bold text-xl">
                  {person.first_name?.[0] || ""}{person.last_name?.[0] || ""}
                </AvatarFallback>
              </Avatar>

              <h4 className="font-bold text-[#1C2238] text-sm line-clamp-1 mb-1">{person.full_name}</h4>
              <div className="flex items-center gap-1.5 text-[10px] text-[#9AA5B8] font-bold uppercase tracking-wider">
                <MapPin size={10} /> {person.nationality || "Unknown"}
              </div>

              <div className="mt-4 px-3 py-1 rounded-full bg-[#EDF1F7] text-[#4F5C72] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Film size={10} /> 12 Movies
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
