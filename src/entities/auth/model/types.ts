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
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
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

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  birth_date?: number;
  gender?: string;
  country?: string;
  city?: string;
  occupation?: string;
  workplace_or_study?: string;
  created_at: number;
}

export interface UpdateProfileRequest {
  name?: string;
  avatar_url?: string;
  birth_date?: number;
  gender?: string;
  country?: string;
  city?: string;
  occupation?: string;
  workplace_or_study?: string;
}
