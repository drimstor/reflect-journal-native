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
  created_at: string;
}
