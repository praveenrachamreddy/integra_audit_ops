import { toast } from 'sonner';
import BaseApiClient, { APIError, } from '.';

// Types
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

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'user' | 'admin' | 'regulator';
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiErrorResponse {
  detail: string;
  status_code?: number;
}

// HTTP Client with automatic token refresh
class AuthAPI extends BaseApiClient {

  private static instance: AuthAPI;

  private constructor() {
    super();
    this.apiPath = '/auth';
  }

  static getInstance(): AuthAPI {
    if (!AuthAPI.instance) {
      AuthAPI.instance = new AuthAPI();
    }
    return AuthAPI.instance;
  }

  // Public API methods
  async register(data: RegisterRequest): Promise<{ message: string }> {
    try {
      const result = await this.makeRequest<{ message: string }>('/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      toast.success('Registration successful! Please check your email to verify your account.');
      return result;
    } catch (error) {
      const message = error instanceof APIError ? error.message : 'Registration failed';
      toast.error(message);
      throw error;
    }
  }

  async verifyEmail(data: VerifyEmailRequest): Promise<{ message: string }> {
    try {
      const result = await this.makeRequest<{ message: string }>('/verify-email', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      toast.success('Email verified successfully! Please check your email for password setup instructions.');
      return result;
    } catch (error) {
      const message = error instanceof APIError ? error.message : 'Email verification failed';
      toast.error(message);
      throw error;
    }
  }

  async setPassword(data: SetPasswordRequest): Promise<{ message: string }> {
    try {
      const result = await this.makeRequest<{ message: string }>('/set-password', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      toast.success('Password set successfully! You can now log in.');
      return result;
    } catch (error) {
      const message = error instanceof APIError ? error.message : 'Password setup failed';
      toast.error(message);
      throw error;
    }
  }

  async login(data: LoginRequest): Promise<TokenResponse> {
    try {
      const result = await this.makeRequest<TokenResponse>('/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      this.setTokens(result.access_token, result.refresh_token)
      toast.success('Login successful!');
      return result;
    } catch (error) {
      const message = error instanceof APIError ? error.message : 'Login failed';
      toast.error(message);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      return await this.makeRequest<User>('/me');
    } catch (error) {
      const message = error instanceof APIError ? error.message : 'Failed to get user data';
      console.error('Get current user error:', message);
      // If getting user fails, clear auth state
      this.clearTokens();
      throw error;
    }
  }

  async logout(): Promise<void> {
    this.clearTokens();
    toast.success('Logged out successfully');
  }

  isLoggedIn(): boolean {
    return this.getAccessToken() !== null;
  }
}

// Export singleton instance
export const authApi = AuthAPI.getInstance();