export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
  avatar_url?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
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
