export interface AffirmationResponse {
  content: string;
  id: string;
  type: "affirmation" | "advice" | "personal_insight";
}

export interface DailyAffirmationRequest {
  language?: string;
}

export interface DailyAdviceRequest {
  language?: string;
}
