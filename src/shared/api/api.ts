import axios from "axios";
import { QueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/src/shared/store/auth.store";

const api = axios.create({
  baseURL: "https://api.example.com",
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
      retry: 3,
    },
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { api };
