import axios from "axios";
import { MovieResponse, MovieParams, MovieDetail, Category, Genre, Actor, Director, Disk } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: `${BASE_URL}/api/v1/public`,
  headers: { "Content-Type": "application/json" },
});

export const apiClient = {
  movies: {
    list: async (params?: MovieParams): Promise<MovieResponse> => {
      const { data } = await api.get("/movies", { params });
      return data;
    },
    get: async (id: number): Promise<{ movie: MovieDetail }> => {
      const { data } = await api.get(`/movies/${id}`);
      return data;
    },
    recent: async (count = 8): Promise<{ movies: import("@/types").MovieList[] }> => {
      const { data } = await api.get("/movies/recent", { params: { count } });
      return data;
    },
    random: async (count = 6): Promise<{ movies: import("@/types").MovieList[] }> => {
      const { data } = await api.get("/movies/random", { params: { count } });
      return data;
    },
  },

  categories: {
    list: async (): Promise<{ categories: (Category & { movie_count: number })[] }> => {
      const { data } = await api.get("/categories");
      return data;
    },
    get: async (
      id: number,
      params?: { page?: number; per_page?: number }
    ): Promise<{ category: Category & { movie_count: number }; movies: import("@/types").MovieList[] }> => {
      const { data } = await api.get(`/categories/${id}`, { params });
      return data;
    },
  },

  genres: {
    list: async (): Promise<{ genres: (Genre & { movie_count: number })[] }> => {
      const { data } = await api.get("/genres");
      return data;
    },
    get: async (
      id: number,
      params?: { page?: number; per_page?: number }
    ): Promise<{ genre: Genre & { movie_count: number }; movies: import("@/types").MovieList[] }> => {
      const { data } = await api.get(`/genres/${id}`, { params });
      return data;
    },
  },

  actors: {
    list: async (params?: { page?: number; per_page?: number; "q[first_name_or_last_name_cont]"?: string }): Promise<{
      actors: Actor[];
      meta: import("@/types").PaginationMeta;
    }> => {
      const { data } = await api.get("/actors", { params });
      return data;
    },
    get: async (id: number): Promise<{ actor: Actor & { movie_count: number }; movies: import("@/types").MovieList[] }> => {
      const { data } = await api.get(`/actors/${id}`);
      return data;
    },
  },

  directors: {
    list: async (params?: { page?: number; per_page?: number }): Promise<{
      directors: Director[];
      meta: import("@/types").PaginationMeta;
    }> => {
      const { data } = await api.get("/directors", { params });
      return data;
    },
    get: async (id: number): Promise<{ director: Director & { movie_count: number }; movies: import("@/types").MovieList[]; meta: import("@/types").PaginationMeta }> => {
      const { data } = await api.get(`/directors/${id}`);
      return data;
    },
  },

  disks: {
    list: async (params?: { page?: number; per_page?: number }): Promise<{
      disks: Disk[];
      meta: import("@/types").PaginationMeta;
    }> => {
      const { data } = await api.get("/disks", { params });
      return data;
    },
    get: async (id: number): Promise<{ disk: Omit<Disk, "movies">; movies: import("@/types").MovieList[] }> => {
      const { data } = await api.get(`/disks/${id}`);
      return data;
    },
  },

  search: async (q: string, limit = 10): Promise<{
    movies: import("@/types").MovieList[];
    actors: Actor[];
    directors: Director[];
  }> => {
    const { data } = await api.get("/search", { params: { q, limit } });
    return data;
  },

  stats: async (): Promise<{
    stats: {
      movies: number;
      disks: number;
      actors: number;
      directors: number;
      storage_gb: number;
      year_range: { min: number; max: number };
    };
    by_category: { name: string; count: number }[];
    by_format: { name: string; count: number }[];
    top_genres: { name: string; count: number }[];
  }> => {
    const { data } = await api.get("/stats");
    return data;
  },
};
