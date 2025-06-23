export interface TestResult {
  id: string;
  test_id: string;
  user_id: string;
  answers: Record<string, string>;
  score?: number;
  result_text?: string;
  ai_analysis?: string;
  related_topics: string[];
  bookmarked: boolean;
  created_at: string;
  updated_at: string;
  // Для отображения в UI
  test_title?: string;
  test_description?: string;
}

export interface CreateTestResultRequest {
  test_id: string;
  answers: Record<string, string>;
  related_topics?: string[];
  bookmarked?: boolean;
}

export interface UpdateTestResultRequest {
  answers?: Record<string, any>;
  score?: number;
  result_text?: string;
  related_topics?: string[];
  bookmarked?: boolean;
}

export interface TestResultResponse {
  data: TestResult[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}
