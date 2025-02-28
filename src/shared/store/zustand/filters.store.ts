import { create } from "zustand";
import { LIMIT } from "@/src/shared/const";

export type SortOrder = "asc" | "desc";
export type SortField = "name" | "created_at" | "updated_at";

export interface FiltersState {
  page: number;
  limit: number;
  search?: string;
  sort_field?: string;
  sort_order?: "asc" | "desc";
  created_at_from?: string;
  created_at_to?: string;
  updated_at_from?: string;
  updated_at_to?: string;

  ai_response?: boolean;
  related_topics?: string;
  bookmarked?: boolean;
}

interface FiltersActions {
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (search: string) => void;
  setSortField: (field: SortField) => void;
  setSortOrder: (order: SortOrder) => void;
  setCreatedAtRange: (from?: string, to?: string) => void;
  setUpdatedAtRange: (from?: string, to?: string) => void;

  setAiResponse: (value: boolean) => void;
  setRelatedTopics: (topics: string) => void;
  setBookmarked: (value: boolean) => void;
  resetFilters: () => void;
}

const initialState: FiltersState = {
  page: 1,
  limit: LIMIT,
  search: undefined,
  sort_field: undefined,
  sort_order: undefined,
  created_at_from: undefined,
  created_at_to: undefined,
  updated_at_from: undefined,
  updated_at_to: undefined,

  ai_response: undefined,
  related_topics: undefined,
  bookmarked: undefined,
};

export const useFiltersStore = create<FiltersState & FiltersActions>((set) => ({
  ...initialState,

  setPage: (page) => set({ page }),

  setLimit: (limit) => set({ page: 1, limit }),

  setSearch: (search) => set({ page: 1, search }),

  setSortField: (sort_field) => set({ page: 1, sort_field }),

  setSortOrder: (sort_order) => set({ page: 1, sort_order }),

  setCreatedAtRange: (created_at_from, created_at_to) =>
    set({ page: 1, created_at_from, created_at_to }),

  setUpdatedAtRange: (updated_at_from, updated_at_to) =>
    set({ page: 1, updated_at_from, updated_at_to }),

  setAiResponse: (ai_response) => set({ page: 1, ai_response }),

  setRelatedTopics: (related_topics) => set({ page: 1, related_topics }),

  setBookmarked: (bookmarked) => set({ page: 1, bookmarked }),

  resetFilters: () => set(initialState),
}));
