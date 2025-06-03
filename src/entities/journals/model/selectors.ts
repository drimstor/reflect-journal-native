import { RootState } from "@/src/shared/store";
import { Journal } from "./types";

interface PaginatedResponse<T> {
  data: T[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

interface QueryCacheEntry<T> {
  status: "fulfilled" | "pending" | "rejected";
  endpointName: string;
  requestId: string;
  originalArgs?: {
    params: string;
  };
  data?: T;
  startedTimeStamp: number;
  fulfilledTimeStamp?: number;
}

// Селектор для получения кеша журнала
export const getJournalCache = (journalId: string) => (state: RootState) => {
  const queryData = state.baseApi.queries?.getJournals as QueryCacheEntry<
    PaginatedResponse<Journal>
  >;
  return queryData?.data?.data?.find((journal) => journal.id === journalId);
};
