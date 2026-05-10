import axios, { AxiosInstance } from "axios";
import { 
  DashboardStats, 
  MovieList, 
  MovieDetail, 
  Disk, 
  User, 
  Genre, 
  Category, 
  Quality, 
  DiskFormat, 
  Reviewer,
  Director,
  Actor,
  TMDbSearchResult,
  PaginationMeta
} from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const api: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add JWT token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const apiClient = {
  auth: {
    login: (credentials: any) => api.post("/admin/login", { user: credentials }),
    logout: () => api.delete("/admin/logout"),
  },
  dashboard: {
    getStats: () => api.get<DashboardStats>("/admin/dashboard").then(res => res.data),
  },
  movies: {
    list: (params: any) => api.get<{ movies: MovieList[], meta: PaginationMeta }>("/admin/movies", { params }).then(res => res.data),
    get: (id: number) => api.get<MovieDetail>(`/admin/movies/${id}`).then(res => res.data),
    create: (data: any) => api.post<MovieDetail>("/admin/movies", { movie: data }).then(res => res.data),
    update: (id: number, data: any) => api.patch<MovieDetail>(`/admin/movies/${id}`, { movie: data }).then(res => res.data),
    delete: (id: number) => api.delete(`/admin/movies/${id}`),
    tmdbSearch: (query: string) => api.post<TMDbSearchResult[]>("/admin/movies/tmdb_search", { query }).then(res => res.data),
  },
  disks: {
    list: () => api.get<Disk[]>("/admin/disks").then(res => res.data),
    get: (id: number) => api.get<Disk>(`/admin/disks/${id}`).then(res => res.data),
    create: (data: any) => api.post<Disk>("/admin/disks", { disk: data }).then(res => res.data),
    update: (id: number, data: any) => api.patch<Disk>(`/admin/disks/${id}`, { disk: data }).then(res => res.data),
    delete: (id: number) => api.delete(`/admin/disks/${id}`),
  },
  people: {
    actors: {
      list: (params: any) => api.get<Actor[]>("/admin/actors", { params }).then(res => res.data),
      get: (id: number) => api.get<Actor>(`/admin/actors/${id}`).then(res => res.data),
      create: (data: any) => api.post<Actor>("/admin/actors", { actor: data }).then(res => res.data),
      update: (id: number, data: any) => api.patch<Actor>(`/admin/actors/${id}`, { actor: data }).then(res => res.data),
      delete: (id: number) => api.delete(`/admin/actors/${id}`),
    },
    directors: {
      list: (params: any) => api.get<Director[]>("/admin/directors", { params }).then(res => res.data),
      get: (id: number) => api.get<Director>(`/admin/directors/${id}`).then(res => res.data),
      create: (data: any) => api.post<Director>("/admin/directors", { director: data }).then(res => res.data),
      update: (id: number, data: any) => api.patch<Director>(`/admin/directors/${id}`, { director: data }).then(res => res.data),
      delete: (id: number) => api.delete(`/admin/directors/${id}`),
    },
  },
  library: {
    genres: {
      list: () => api.get<Genre[]>("/admin/genres").then(res => res.data),
      create: (data: any) => api.post<Genre>("/admin/genres", data).then(res => res.data),
      update: (id: number, data: any) => api.patch<Genre>(`/admin/genres/${id}`, data).then(res => res.data),
      delete: (id: number) => api.delete(`/admin/genres/${id}`),
    },
    categories: {
      list: () => api.get<Category[]>("/admin/categories").then(res => res.data),
      create: (data: any) => api.post<Category>("/admin/categories", data).then(res => res.data),
      update: (id: number, data: any) => api.patch<Category>(`/admin/categories/${id}`, data).then(res => res.data),
      delete: (id: number) => api.delete(`/admin/categories/${id}`),
    },
    // ... other library endpoints follow similar pattern
  },
  users: {
    list: () => api.get<User[]>("/admin/users").then(res => res.data),
    create: (data: any) => api.post<User>("/admin/users", { user: data }).then(res => res.data),
    update: (id: number, data: any) => api.patch<User>(`/admin/users/${id}`, { user: data }).then(res => res.data),
    delete: (id: number) => api.delete(`/admin/users/${id}`),
  }
};

export default api;
