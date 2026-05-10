"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  Film, 
  HardDrive, 
  Users, 
  Database, 
  Plus, 
  TrendingUp, 
  Clock,
  ArrowRight
} from "lucide-react";
import { apiClient } from "@/lib/api";
import StatCard from "@/components/shared/StatCard";
import PosterImage from "@/components/shared/PosterImage";
import { QualityBadge, DiskBadge } from "@/components/shared/Badges";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => apiClient.dashboard.getStats(),
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = user?.email?.split("@")[0] || "Admin";
    if (hour < 12) return `Good morning, ${name} 👋`;
    if (hour < 18) return `Good afternoon, ${name} 👋`;
    return `Good evening, ${name} 👋`;
  };

  if (isLoading) return <div>Loading...</div>; // Skeleton would be better, but simplified for now

  const stats = data?.stats;
  const recentMovies = data?.recent_movies || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Greeting Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#1C2238] tracking-tight">{getGreeting()}</h2>
        <p className="text-[#4F5C72] mt-1 font-medium">Here&apos;s what&apos;s happening with your library today.</p>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Movies"
          value={stats?.movies.total || 0}
          subLabel="+12 this week"
          accentColor="#4299EB"
          icon={Film}
        />
        <StatCard
          label="Total Disks"
          value={stats?.disks.total || 0}
          subLabel="DVD · HDD · Blu-ray"
          accentColor="#46BB78"
          icon={HardDrive}
        />
        <StatCard
          label="Cast & Crew"
          value={(stats?.people.actors || 0) + (stats?.people.directors || 0)}
          subLabel="Actors & Directors"
          accentColor="#9A62FA"
          icon={Users}
        />
        <StatCard
          label="Storage Used"
          value={`${stats?.storage.total_gb || 0} GB`}
          subLabel="Across all media"
          accentColor="#F5BD32"
          icon={Database}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Movies by Category - Horizontal Bar Chart */}
        <Card className="p-6 border-none shadow-sm col-span-1">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-[#1C2238]">Movies by Category</h3>
            <TrendingUp size={18} className="text-[#9AA5B8]" />
          </div>
          <div className="space-y-5">
            {stats?.movies?.by_category?.map((cat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#4F5C72]">{cat.name}</span>
                  <span className="text-[#1C2238]">{cat.count}</span>
                </div>
                <div className="h-1.5 w-full bg-[#EDF1F7] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#4299EB] rounded-full transition-all duration-500" 
                    style={{ width: `${(cat.count / (stats.movies.total || 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* By Disk Format - Donut Chart (Simulated with CSS) */}
        <Card className="p-6 border-none shadow-sm col-span-1">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-[#1C2238]">By Disk Format</h3>
            <HardDrive size={18} className="text-[#9AA5B8]" />
          </div>
          <div className="flex flex-col items-center justify-center h-full pb-8">
            <div className="relative w-40 h-40">
              <div 
                className="w-full h-full rounded-full"
                style={{ 
                  background: `conic-gradient(#4299EB 0% 40%, #46BB78 40% 70%, #9A62FA 70% 90%, #F5BD32 90% 100%)` 
                }}
              />
              <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                <span className="text-3xl font-bold text-[#1C2238]">{stats?.disks.total || 0}</span>
                <span className="text-[10px] font-bold text-[#9AA5B8] uppercase tracking-wider">Disks</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-8">
              {stats?.disks?.by_format?.map((format, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="text-sm font-bold text-[#1C2238]">{format.count}</div>
                  <div className="text-[10px] font-bold text-[#9AA5B8] uppercase">{format.name}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Needs Attention */}
        <Card className="p-6 border-none shadow-sm col-span-1 bg-[#16213E] text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#4299EB] opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          
          <h3 className="font-bold mb-2">Needs Attention</h3>
          <p className="text-[#8892B0] text-sm mb-8 font-medium">You have movies that haven&apos;t been assigned to a physical disk yet.</p>
          
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-5xl font-bold text-[#4299EB] mb-1">{stats?.movies.without_disk || 0}</div>
            <div className="text-[10px] font-bold text-[#8892B0] uppercase tracking-wider">Unassigned Movies</div>
          </div>

          <Button className="w-full mt-8 bg-[#4299EB] hover:bg-[#3182CE] text-white font-bold h-11">
            Assign to Disks <ArrowRight size={16} className="ml-2" />
          </Button>
        </Card>
      </div>

      {/* Recently Added Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-[#4299EB] " />
            <h3 className="text-lg font-bold text-[#1C2238]">Recently Added</h3>
          </div>
          <Link href="/admin/movies" className="text-sm font-bold text-[#4299EB] hover:underline flex items-center gap-1">
            View all movies <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {recentMovies?.map((movie) => (
            <Link key={movie.id} href={`/admin/movies/${movie.id}`} className="group block">
              <div className="aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-[#C8D0DC] shadow-sm group-hover:shadow-md transition-all relative">
                <PosterImage src={movie.poster_url} alt={movie.name} className="w-full h-full" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-[10px] font-bold uppercase tracking-wider border border-white/20">
                    View Detail
                  </div>
                </div>
              </div>
              <h4 className="font-bold text-sm text-[#1C2238] truncate group-hover:text-[#4299EB] transition-colors">{movie.name}</h4>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {movie.genres?.slice(0, 2).map((genre) => (
                  <span key={genre.id} className="text-[9px] font-bold text-[#9AA5B8] uppercase">
                    {genre.name}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Actions Row */}
      <section>
        <h3 className="text-lg font-bold text-[#1C2238] mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Import from TMDb", desc: "Auto-fetch movie metadata", icon: Database, color: "#4299EB", href: "/admin/movies/new" },
            { label: "Add New Disk", desc: "Register a physical HDD/DVD", icon: HardDrive, color: "#46BB78", href: "/admin/disks" },
            { label: "Add Actor/Director", desc: "Manage cast and crew", icon: Users, color: "#9A62FA", href: "/admin/people/actors" },
            { label: "Manage Users", desc: "Update roles and permissions", icon: UserCircle, color: "#F5BD32", href: "/admin/users" },
          ].map((action, i) => (
            <Link key={i} href={action.href}>
              <Card className="p-5 border-none shadow-sm hover:shadow-md transition-all group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div 
                    className="p-3 rounded-xl transition-colors shrink-0"
                    style={{ backgroundColor: `${action.color}15` }}
                  >
                    <action.icon size={22} style={{ color: action.color }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1C2238] text-sm group-hover:text-[#4299EB] transition-colors">{action.label}</h4>
                    <p className="text-[11px] text-[#4F5C72] font-medium mt-0.5">{action.desc}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

import { UserCircle } from "lucide-react";
