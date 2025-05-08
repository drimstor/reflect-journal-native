import { create } from "zustand";
import { LIMIT } from "@/src/shared/const";

export type SortOrder = "asc" | "desc";
export type SortField =
  | "name"
  | "created_at"
  | "updated_at"
  | "quantity"
  | "count";

export interface FiltersState {
  page?: number;
  limit: number;
  search?: string;
  sort_field?: string;
  sort_order?: "asc" | "desc";
  created_at_from?: string;
  created_at_to?: string;
  updated_at_from?: string;
  updated_at_to?: string;

  multi_select?: boolean;
  multi_select_ids?: string[];
  is_completed?: boolean;
  ai_response?: boolean;
  related_topics?: string;
  bookmarked?: boolean;
  category?: string;
}

interface FiltersActions {
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (search: string) => void;
  setSortField: (field: SortField | undefined) => void;
  setSortOrder: (order: SortOrder | undefined) => void;
  setCreatedAtRange: (from?: string, to?: string) => void;
  setUpdatedAtRange: (from?: string, to?: string) => void;

  setMultiSelect: (multi_select: boolean | undefined) => void;
  setMultiSelectIds: (ids: string[]) => void;
  setIsCompleted: (is_completed: boolean | undefined) => void;
  setAiResponse: (value: boolean | undefined) => void;
  setRelatedTopics: (topics: string | undefined) => void;
  setBookmarked: (value: boolean | undefined) => void;
  setCategory: (category: string | undefined) => void;
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

  multi_select: undefined,
  multi_select_ids: undefined,
  is_completed: undefined,
  ai_response: undefined,
  related_topics: undefined,
  bookmarked: undefined,
  category: undefined,
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

  setMultiSelect: (multi_select) =>
    set({ page: 1, multi_select_ids: undefined, multi_select }),

  setMultiSelectIds: (multi_select_ids) => set({ page: 1, multi_select_ids }),

  setIsCompleted: (is_completed) => set({ page: 1, is_completed }),

  setAiResponse: (ai_response) => set({ page: 1, ai_response }),

  setRelatedTopics: (related_topics) => set({ page: 1, related_topics }),

  setBookmarked: (bookmarked) => set({ page: 1, bookmarked }),

  setCategory: (category) => set({ page: 1, category }),

  resetFilters: () => set(initialState),
}));
