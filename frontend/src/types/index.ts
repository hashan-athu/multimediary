export interface Category {
  id: number;
  name: string;
}

export interface Genre {
  id: number;
  name: string;
  description?: string;
}

export interface Quality {
  id: number;
  name: string;
}

export interface Disk {
  id: number;
  name: string;
  storage_type: string;
  format: string;
}

export interface Movie {
  id: number;
  name: string;
  year: number;
  language?: string;
  country?: string;
  runtime?: string;
  tagline?: string;
  description?: string;
  poster_url?: string;
  has_poster: boolean;
  category: Category;
  genres: Genre[];
  qualities: Quality[];
  disk?: Disk;
  file_size: number;
}

export interface PaginationMeta {
  current_page: number;
  total_pages: number;
  total_count: number;
  per_page: number;
}

export interface MovieResponse {
  movies: Movie[];
  meta: PaginationMeta;
}

export interface MovieParams {
  page?: number;
  per_page?: number;
  sort?: string;
  direction?: "asc" | "desc";
  "q[name_cont]"?: string;
  "q[category_id_eq]"?: string;
  "q[genres_id_eq]"?: string;
  "q[year_eq]"?: string;
}
