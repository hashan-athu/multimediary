'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Clapperboard, Users, HardDrive, Disc } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardStats {
  movies: {
    total: number;
    without_disk: number;
  };
  people: {
    actors: number;
    directors: number;
  };
  disks: {
    total: number;
  };
  storage: {
    total_gb: number;
  };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetchApi('/admin/dashboard');
        if (response.ok) {
          const result = await response.json();
          // The API returns { stats: {...}, recent_movies: [...] }
          setStats(result.stats);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const formatStorage = (gb: number) => {
    if (!gb || gb === 0) return '0 GB';
    if (gb < 1024) return `${gb} GB`;
    return `${(gb / 1024).toFixed(2)} TB`;
  };

  const statCards = [
    { title: 'Total Movies', value: stats?.movies.total || 0, icon: Clapperboard, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { title: 'Total Actors', value: stats?.people.actors || 0, icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { title: 'Physical Disks', value: stats?.disks.total || 0, icon: Disc, color: 'text-teal-400', bg: 'bg-teal-400/10' },
    { title: 'Total Storage', value: stats ? formatStorage(stats.storage.total_gb) : '0 GB', icon: HardDrive, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Dashboard Overview</h1>
        <p className="text-zinc-400 mt-1">Here's what's happening in your physical media library today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-zinc-900/40 border-zinc-800">
              <CardContent className="p-6">
                <Skeleton className="h-10 w-10 rounded-xl mb-4 bg-zinc-800" />
                <Skeleton className="h-4 w-24 mb-2 bg-zinc-800" />
                <Skeleton className="h-8 w-16 bg-zinc-800" />
              </CardContent>
            </Card>
          ))
        ) : (
          statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-zinc-900/40 border-zinc-800 hover:bg-zinc-900/60 transition-colors">
                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-400">{stat.title}</p>
                    <h3 className="text-3xl font-bold text-zinc-100 mt-1">{stat.value}</h3>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
