import { PaginationResponse } from "@/src/shared/model/types";

export interface Entity {
  // TODO: Определить структуру Entity, когда будет доступна
  id: string;
  [key: string]: any;
}

export interface Journal {
  id: string;
  name: string;
  description: string;
  user_id: string;
  ai_response: boolean;
  created_at: string;
  updated_at: string;
  related_topics: string[];
  related_entities: Entity[];
  entries_count: number;
  bookmarked: boolean;
}

export interface CreateJournalRequest {
  name: string;
  description: string;
  related_topics?: string[];
  bookmarked?: boolean;
}

export interface UpdateJournalRequest {
  name?: string;
  description?: string;
  related_topics?: string[];
  ai_response?: boolean;
  bookmarked?: boolean;
}

export interface JournalResponse extends PaginationResponse<Journal> {}

export interface JournalEntry {
  id: string;
  content: string;
  user_id: string;
  journal_id: string;
  created_at: string;
  updated_at: string;
  related_topics: string[];
  ai_response: string;
  bookmarked: boolean;
}

export interface CreateJournalEntryRequest {
  content: string;
  journal_id: string;
  related_topics?: string[];
  bookmarked?: boolean;
}

export interface UpdateJournalEntryRequest {
  content?: string;
  related_topics?: string[];
  bookmarked?: boolean;
}

export interface JournalEntryResponse {
  data: JournalEntry[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}
