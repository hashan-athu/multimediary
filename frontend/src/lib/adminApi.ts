import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import {
  Actor,
  Category,
  DiskFormat,
  Director,
  Disk,
  Genre,
  MovieDetail,
  MovieList,
  PaginationMeta,
  Quality,
  Rating,
  Reviewer,
  TMDbSearchResult,
  User,
} from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const adminApi = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
});

export function getCookieToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)mm_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

adminApi.interceptors.request.use((config) => {
  const token =
    (typeof window !== "undefined" ? useAuthStore.getState().token : null) ||
    getCookieToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

adminApi.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      useAuthStore.getState().clearAuth();
      document.cookie = "mm_token=; path=/; max-age=0";
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export function extractApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data?.errors && Array.isArray(data.errors)) return data.errors.join(", ");
    if (data?.error) return data.error;
    if (data?.message) return data.message;
    if (error.response?.status === 422) return "Validation failed — check your inputs";
    if (error.response?.status === 403) return "You don't have permission for this action";
    if (error.response?.status === 409) return "This record already exists";
    if (error.response?.status === 404) return "Record not found";
  }
  return "Something went wrong — please try again";
}

export const apiClient = {
  auth: {
    login: (creds: { email: string; password: string }) =>
      adminApi.post("/admin/login", { user: creds }),
    logout: () => adminApi.delete("/admin/logout"),
  },

  dashboard: {
    getStats: () => adminApi.get("/admin/dashboard").then((r) => r.data),
  },

  movies: {
    list: (params: Record<string, unknown> = {}) =>
      adminApi.get("/admin/movies", { params }).then((r) => r.data as { movies: MovieList[]; meta: PaginationMeta }),
    get: (id: number) =>
      adminApi.get(`/admin/movies/${id}`).then((r) => r.data.movie as MovieDetail),
    create: (data: Record<string, unknown>) =>
      adminApi.post("/admin/movies", { movie: data }).then((r) => r.data.movie as MovieDetail),
    update: (id: number, data: Record<string, unknown>) =>
      adminApi.patch(`/admin/movies/${id}`, { movie: data }).then((r) => r.data.movie as MovieDetail),
    delete: (id: number) => adminApi.delete(`/admin/movies/${id}`),
    tmdbSearch: (query: string) =>
      adminApi.post("/admin/movies/tmdb_search", { query }).then((r) => r.data.results as TMDbSearchResult[]),
    tmdbImport: (params: {
      tmdb_id: number;
      disk_id: number;
      category_id: number;
      quality_ids?: number[];
      file_size?: string;
      version?: string;
    }) => adminApi.post("/admin/movies/tmdb_import", params).then((r) => r.data.movie as MovieDetail),
  },

  actors: {
    list: (params: Record<string, unknown> = {}) =>
      adminApi.get("/admin/actors", { params }).then((r) => ({
        actors: r.data.actors as Actor[],
        meta: r.data.meta as PaginationMeta,
      })),
    get: (id: number) => adminApi.get(`/admin/actors/${id}`).then((r) => r.data.actor as Actor),
    create: (data: Record<string, unknown>) =>
      adminApi.post("/admin/actors", { actor: data }).then((r) => r.data.actor as Actor),
    update: (id: number, data: Record<string, unknown>) =>
      adminApi.patch(`/admin/actors/${id}`, { actor: data }).then((r) => r.data.actor as Actor),
    delete: (id: number) => adminApi.delete(`/admin/actors/${id}`),
  },

  directors: {
    list: (params: Record<string, unknown> = {}) =>
      adminApi.get("/admin/directors", { params }).then((r) => ({
        directors: r.data.directors as Director[],
        meta: r.data.meta as PaginationMeta,
      })),
    get: (id: number) =>
      adminApi.get(`/admin/directors/${id}`).then((r) => r.data.director as Director),
    create: (data: Record<string, unknown>) =>
      adminApi.post("/admin/directors", { director: data }).then((r) => r.data.director as Director),
    update: (id: number, data: Record<string, unknown>) =>
      adminApi.patch(`/admin/directors/${id}`, { director: data }).then((r) => r.data.director as Director),
    delete: (id: number) => adminApi.delete(`/admin/directors/${id}`),
  },

  disks: {
    list: (params: Record<string, unknown> = {}) =>
      adminApi.get("/admin/disks", { params }).then((r) => ({
        disks: r.data.disks as Disk[],
        meta: r.data.meta as PaginationMeta,
      })),
    get: (id: number) => adminApi.get(`/admin/disks/${id}`).then((r) => r.data.disk as Disk),
    create: (data: Record<string, unknown>) =>
      adminApi.post("/admin/disks", { disk: data }).then((r) => r.data.disk as Disk),
    update: (id: number, data: Record<string, unknown>) =>
      adminApi.patch(`/admin/disks/${id}`, { disk: data }).then((r) => r.data.disk as Disk),
    delete: (id: number) => adminApi.delete(`/admin/disks/${id}`),
  },

  genres: {
    list: (params: Record<string, unknown> = {}) =>
      adminApi.get("/admin/genres", { params }).then((r) => ({
        genres: r.data.genres as Genre[],
        meta: r.data.meta as PaginationMeta,
      })),
    create: (data: Record<string, unknown>) =>
      adminApi.post("/admin/genres", { genre: data }).then((r) => r.data.genre as Genre),
    update: (id: number, data: Record<string, unknown>) =>
      adminApi.patch(`/admin/genres/${id}`, { genre: data }).then((r) => r.data.genre as Genre),
    delete: (id: number) => adminApi.delete(`/admin/genres/${id}`),
  },

  categories: {
    list: (params: Record<string, unknown> = {}) =>
      adminApi.get("/admin/categories", { params }).then((r) => ({
        categories: r.data.categories as Category[],
        meta: r.data.meta as PaginationMeta,
      })),
    create: (data: Record<string, unknown>) =>
      adminApi.post("/admin/categories", { category: data }).then((r) => r.data.category as Category),
    update: (id: number, data: Record<string, unknown>) =>
      adminApi.patch(`/admin/categories/${id}`, { category: data }).then((r) => r.data.category as Category),
    delete: (id: number) => adminApi.delete(`/admin/categories/${id}`),
  },

  qualities: {
    list: (params: Record<string, unknown> = {}) =>
      adminApi.get("/admin/qualities", { params }).then((r) => ({
        qualities: r.data.qualities as Quality[],
        meta: r.data.meta as PaginationMeta,
      })),
    create: (data: Record<string, unknown>) =>
      adminApi.post("/admin/qualities", { quality: data }).then((r) => r.data.quality as Quality),
    update: (id: number, data: Record<string, unknown>) =>
      adminApi.patch(`/admin/qualities/${id}`, { quality: data }).then((r) => r.data.quality as Quality),
    delete: (id: number) => adminApi.delete(`/admin/qualities/${id}`),
  },

  diskFormats: {
    list: (params: Record<string, unknown> = {}) =>
      adminApi.get("/admin/disk_formats", { params }).then((r) => ({
        disk_formats: r.data.disk_formats as DiskFormat[],
        meta: r.data.meta as PaginationMeta,
      })),
    create: (data: Record<string, unknown>) =>
      adminApi.post("/admin/disk_formats", { disk_format: data }).then((r) => r.data.disk_format as DiskFormat),
    update: (id: number, data: Record<string, unknown>) =>
      adminApi.patch(`/admin/disk_formats/${id}`, { disk_format: data }).then((r) => r.data.disk_format as DiskFormat),
    delete: (id: number) => adminApi.delete(`/admin/disk_formats/${id}`),
  },

  reviewers: {
    list: (params: Record<string, unknown> = {}) =>
      adminApi.get("/admin/reviewers", { params }).then((r) => ({
        reviewers: r.data.reviewers as Reviewer[],
        meta: r.data.meta as PaginationMeta,
      })),
    create: (data: Record<string, unknown>) =>
      adminApi.post("/admin/reviewers", { reviewer: data }).then((r) => r.data.reviewer as Reviewer),
    update: (id: number, data: Record<string, unknown>) =>
      adminApi.patch(`/admin/reviewers/${id}`, { reviewer: data }).then((r) => r.data.reviewer as Reviewer),
    delete: (id: number) => adminApi.delete(`/admin/reviewers/${id}`),
  },

  ratings: {
    list: (movieId: number) =>
      adminApi.get(`/admin/movies/${movieId}/ratings`).then((r) => r.data.ratings as Rating[]),
    create: (movieId: number, data: Record<string, unknown>) =>
      adminApi.post(`/admin/movies/${movieId}/ratings`, { rating: data }).then((r) => r.data.rating as Rating),
    update: (movieId: number, ratingId: number, data: Record<string, unknown>) =>
      adminApi.patch(`/admin/movies/${movieId}/ratings/${ratingId}`, { rating: data }).then((r) => r.data.rating as Rating),
    delete: (movieId: number, ratingId: number) =>
      adminApi.delete(`/admin/movies/${movieId}/ratings/${ratingId}`),
  },

  users: {
    list: (params: Record<string, unknown> = {}) =>
      adminApi.get("/admin/users", { params }).then((r) => ({
        users: r.data.users as User[],
        meta: r.data.meta as PaginationMeta,
      })),
    get: (id: number) => adminApi.get(`/admin/users/${id}`).then((r) => r.data.user as User),
    create: (data: Record<string, unknown>) =>
      adminApi.post("/admin/users", { user: data }).then((r) => r.data.user as User),
    update: (id: number, data: Record<string, unknown>) =>
      adminApi.patch(`/admin/users/${id}`, { user: data }).then((r) => r.data.user as User),
    delete: (id: number) => adminApi.delete(`/admin/users/${id}`),
  },
};

export const api = adminApi;

export default adminApi;
