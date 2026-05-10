'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Image as ImageIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Movie {
  id: number;
  name: string;
  year: number;
  director?: { first_name: string; last_name: string };
  genres: { id: number; name: string }[];
  poster_url: string;
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const response = await fetchApi('/admin/movies');
        if (response.ok) {
          const data = await response.json();
          // API returns an array, or an object with an array depending on pagination meta
          setMovies(data.movies || data || []);
        }
      } catch (error) {
        console.error("Failed to fetch movies", error);
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Movies</h1>
          <p className="text-zinc-400 mt-1">Manage your physical media catalogue.</p>
        </div>
        <Dialog>
          <DialogTrigger render={
            <Button className="bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-900/20">
              <Plus className="mr-2 h-4 w-4" />
              Add Movie
            </Button>
          } />
          <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-zinc-50">
            <DialogHeader>
              <DialogTitle>Add New Movie</DialogTitle>
            </DialogHeader>
            <div className="py-4 text-zinc-400">
              {/* Form placeholder */}
              This form will include fields for title, year, director, disk selection, and TMDb import functionality.
            </div>
            <div className="flex justify-end">
              <Button className="bg-teal-600 hover:bg-teal-500 text-white">Save changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {loading ? (
          Array.from({ length: 10 }).map((_, i) => (
            <Card key={i} className="bg-zinc-900/40 border-zinc-800 overflow-hidden">
              <Skeleton className="h-64 w-full bg-zinc-800 rounded-none" />
              <CardContent className="p-4">
                <Skeleton className="h-5 w-3/4 mb-2 bg-zinc-800" />
                <Skeleton className="h-4 w-1/2 bg-zinc-800" />
              </CardContent>
            </Card>
          ))
        ) : (
          movies.map((movie) => (
            <Card key={movie.id} className="bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 transition-colors group overflow-hidden flex flex-col">
              <div className="aspect-[2/3] w-full bg-zinc-900 relative">
                {movie.poster_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={movie.poster_url} 
                    alt={movie.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-800">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent opacity-60 pointer-events-none" />
              </div>
              <CardContent className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-zinc-100 line-clamp-1" title={movie.name}>
                  {movie.name} <span className="text-zinc-500 font-normal">({movie.year})</span>
                </h3>
                {movie.director && (
                  <p className="text-sm text-zinc-400 mt-1 line-clamp-1">
                    {movie.director.first_name} {movie.director.last_name}
                  </p>
                )}
                <div className="flex flex-wrap gap-1 mt-auto pt-3">
                  {movie.genres?.slice(0, 2).map((genre) => (
                    <span key={genre.id} className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                      {genre.name}
                    </span>
                  ))}
                  {movie.genres?.length > 2 && (
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                      +{movie.genres.length - 2}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
