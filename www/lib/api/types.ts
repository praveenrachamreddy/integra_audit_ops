export interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface RegisterRequest {
  email: string;
  first_name: string;
  last_name: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface SetPasswordRequest {
  token: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiErrorResponse {
  detail: string;
  status_code?: number;
} 