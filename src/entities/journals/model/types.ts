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
}

export interface CreateJournalRequest {
  name: string;
  description: string;
  related_topics?: string[];
}

export interface UpdateJournalRequest {
  name?: string;
  description?: string;
  related_topics?: string[];
  ai_response?: boolean;
}

export interface JournalResponse extends PaginationResponse<Journal> {}
