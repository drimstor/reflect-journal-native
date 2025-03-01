export interface Entity {
  id: string;
  entity_type: string;
  name: string;
}

export interface Summary {
  id: string;
  content: string;
  name?: string;
  user_id?: string;
  related_topics: string[];
  related_entities: Entity[];
  created_at: string;
  updated_at?: string;
  bookmarked: boolean;
}

export interface SummaryResponse {
  data: Summary[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export interface CreateSummaryRequest {
  topic: string;
  name?: string;
}

export interface UpdateSummaryRequest {
  name?: string;
  related_topics?: string[];
  bookmarked?: boolean;
}
