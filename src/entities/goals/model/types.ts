export interface ChecklistItem {
  id: string;
  title: string;
  is_completed: boolean;
  completed_at: string | null;
}

export interface Entity {
  id: string;
  entity_type: string;
  name: string;
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  checklist: ChecklistItem[];
  created_at: string;
  updated_at: string | null;
  related_entities: Entity[] | null;
  related_topics: string[] | null;
  is_completed: boolean;
  bookmarked: boolean;
}

export interface GoalResponse {
  data: Goal[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export interface CreateGoalRequest {
  message_id: string;
}

export interface UpdateGoalRequest {
  name?: string;
  bookmarked?: boolean;
  related_topics?: string[];
}

export interface AddChecklistItemRequest {
  title: string;
}

export interface UpdateChecklistItemRequest {
  is_completed: boolean;
}
