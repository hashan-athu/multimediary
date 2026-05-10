export type Role = "super_admin" | "admin" | "editor" | "analyst";

export interface User {
  id: number;
  email: string;
  role: Role;
  created_at: string;
}

export interface Category   { id: number; name: string; }
export interface Genre      { id: number; name: string; description?: string; }
export interface Quality    { id: number; name: string; }
export interface DiskFormat { id: number; name: string; }
export interface Reviewer   { id: number; name: string; website_url?: string; }

export interface Director {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  date_of_birth?: string;
  nationality?: string;
  image_url?: string;
}

export interface Actor {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  gender?: "male" | "female" | "other";
  date_of_birth?: string;
  nationality?: string;
  image_url?: string;
}

export interface DiskCompact {
  id: number;
  name: string;
  storage_type: string;
  disk_format: DiskFormat;
}

export interface Disk extends DiskCompact {
  movie_count: number;
  movies: MovieList[];
}

export interface Rating {
  id: number;
  rating_value: number;
  rating_out_of: number;
  reviewer: Reviewer;
}

export interface MovieList {
  id: number;
  name: string;
  year?: number;
  language?: string;
  country?: string;
  runtime?: number;
  file_size?: number;
  version?: string;
  poster_url?: string;
  tagline?: string;
  tmdb_id?: number;
  category: Category;
  disk: DiskCompact;
  genres: Genre[];
  qualities: Quality[];
}

export interface MovieDetail extends MovieList {
  description?: string;
  story?: string;
  director?: Director;
  actors: Actor[];
  ratings: Rating[];
}

export interface PaginationMeta {
  current_page: number;
  total_pages: number;
  total_count: number;
  per_page: number;
}

export interface DashboardStats {
  stats: {
    movies: {
      total: number;
      by_category: { name: string; count: number }[];
      by_format: { name: string; count: number }[];
      without_disk: number;
    };
    disks: {
      total: number;
      by_format: { name: string; count: number }[];
    };
    people: { actors: number; directors: number };
    storage: { total_gb: number };
  };
  recent_movies: MovieList[];
}

export interface TMDbSearchResult {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_path?: string;
}
