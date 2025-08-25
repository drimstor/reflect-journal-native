export interface AffirmationResponse {
  content: string;
  id: string;
  type: "affirmation" | "advice" | "personal_insight";
  category?: string;
}

export interface DailyAffirmationRequest {
  language?: string;
}

export interface DailyAdviceRequest {
  excluded_categories?: string[];
}
