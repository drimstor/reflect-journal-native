export interface AssistantStrategy {
  id: string;
  user_id: string;
  role?: string;
  tone?: string[];
  communication_style?: string[];
  additional_info?: string;
  updated_at: number;
  growth_points?: string;
}

export interface AssistantTemplate {
  id: string;
  name: string;
  role: string;
  tone: string[];
  communication_style: string[];
  additional_info?: string;
}
