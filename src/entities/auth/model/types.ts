export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
  avatar_url?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  is_new_user?: boolean;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  is_new_user?: boolean;
  message?: string;
  detailed?: Record<string, any>;
}

export interface SocialAuthRequest {
  email: string;
  auth_type: "google" | "apple";
  user_id: string;
  name?: string;
  avatar_url?: string;
}

export type SubscriptionPlan = "free" | "pro";

export interface SubscriptionInfo {
  plan: SubscriptionPlan;
  exp: number;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  birth_date?: number;
  gender?: string;
  country?: string;
  subscription?: SubscriptionInfo;
  created_at: number;
}

export interface VerifyReceiptRequest {
  receipt_data: string;
  platform: "apple" | "google";
  product_id?: string;
}

export interface SubscriptionResponse {
  message: string;
  subscription: SubscriptionInfo;
}

export interface UpdateProfileRequest {
  name?: string;
  avatar_url?: string;
  birth_date?: number;
  gender?: string;
  country?: string;
}
