import axios from "axios";
import { MovieResponse, MovieParams } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1/public";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiClient = {
  movies: {
    list: async (params?: MovieParams): Promise<MovieResponse> => {
      const { data } = await api.get("/movies", { params });
      return data;
    },
    get: async (id: number) => {
      const { data } = await api.get(`/movies/${id}`);
      return data;
    },
  },
  // Adding placeholders for taxonomies if public endpoints exist later
  taxonomies: {
    categories: async () => {
      // Backend CLAUDE.md doesn't mention public taxonomies, 
      // but we might need them for filtering.
      // If they don't exist, we'll fetch them from the admin or handle gracefully.
      return [];
    },
  },
};
