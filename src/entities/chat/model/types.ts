export interface Entity {
  // TODO: определить структуру Entity когда будет известна
  id: string;
  [key: string]: any;
}

export interface Chat {
  user_id: string;
  name: string;
  description: string;
  id: string;
  created_at: string;
  updated_at: string;
  related_topics: string[];
  related_entities: Entity[];
  bookmarked: boolean;
}

export interface CreateChatRequest {
  name: string;
  description?: string;
  related_topics?: string[];
}

export interface UpdateChatRequest {
  name?: string;
  description?: string;
  related_topics?: string[];
  related_entities?: Entity[];
  bookmarked?: boolean;
}

export interface ChatResponse {
  data: Chat[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export type SortField = "name" | "created_at" | "updated_at";
export type SortOrder = "asc" | "desc";
