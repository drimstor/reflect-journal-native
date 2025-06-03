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
  summary_type: string;
  entity_id?: string;
  topics?: string[];
  categories?: string[];
  created_at_from?: string;
  created_at_to?: string;
  additional_info?: string;
  name?: string;
}

export interface UpdateSummaryRequest {
  name?: string;
  related_topics?: string[];
  bookmarked?: boolean;
}
