import { toast } from 'sonner';

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

export interface RefreshTokenRequest {
  refresh_token: string;
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

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
const API_V1_STR = '/api/v1';

// Token management
export class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'regops_access_token';
  private static readonly REFRESH_TOKEN_KEY = 'regops_refresh_token';

  static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  static clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static isLoggedIn(): boolean {
    return this.getAccessToken() !== null;
  }
}

// HTTP Client with automatic token refresh
class ApiClient {
  private isRefreshing = false;
  private refreshPromise: Promise<string> | null = null;

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${API_V1_STR}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // Add auth header if token exists
    const accessToken = TokenManager.getAccessToken();
    if (accessToken) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${accessToken}`,
      };
    }

    let response = await fetch(url, config);

    // Handle token refresh if needed
    if (response.status === 401 && accessToken && !endpoint.includes('/refresh')) {
      const newToken = await this.handleTokenRefresh();
      if (newToken) {
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${newToken}`,
        };
        response = await fetch(url, config);
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new ApiError(errorData.detail ?? 'An error occurred', response.status);
    }

    return response.json();
  }

  private async handleTokenRefresh(): Promise<string | null> {
    if (this.isRefreshing) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    const refreshToken = TokenManager.getRefreshToken();

    if (!refreshToken) {
      this.isRefreshing = false;
      TokenManager.clearTokens();
      this.handleAuthError();
      return null;
    }

    try {
      this.refreshPromise = this.refreshAccessToken(refreshToken);
      const newAccessToken = await this.refreshPromise;
      return newAccessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      TokenManager.clearTokens();
      this.handleAuthError();
      return null;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async refreshAccessToken(refreshToken: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}${API_V1_STR}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data: TokenResponse = await response.json();
    TokenManager.setTokens(data.access_token, data.refresh_token);
    return data.access_token;
  }

  private handleAuthError(): void {
    // Clear tokens and redirect to login with current page as redirect
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname + window.location.search;
      const redirectTo = encodeURIComponent(currentPath);
      window.location.href = `/login?redirectTo=${redirectTo}`;
    }
  }

  // Public API methods
  async register(data: RegisterRequest): Promise<{ message: string }> {
    try {
      const result = await this.makeRequest<{ message: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      toast.success('Registration successful! Please check your email to verify your account.');
      return result;
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Registration failed';
      toast.error(message);
      throw error;
    }
  }

  async verifyEmail(data: VerifyEmailRequest): Promise<{ message: string }> {
    try {
      const result = await this.makeRequest<{ message: string }>('/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      toast.success('Email verified successfully! Please check your email for password setup instructions.');
      return result;
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Email verification failed';
      toast.error(message);
      throw error;
    }
  }

  async setPassword(data: SetPasswordRequest): Promise<{ message: string }> {
    try {
      const result = await this.makeRequest<{ message: string }>('/auth/set-password', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      toast.success('Password set successfully! You can now log in.');
      return result;
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Password setup failed';
      toast.error(message);
      throw error;
    }
  }

  async login(data: LoginRequest): Promise<TokenResponse> {
    try {
      const result = await this.makeRequest<TokenResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      TokenManager.setTokens(result.access_token, result.refresh_token);
      toast.success('Login successful!');
      return result;
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Login failed';
      toast.error(message);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      return await this.makeRequest<User>('/auth/me');
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to get user data';
      console.error('Get current user error:', message);
      throw error;
    }
  }

  async logout(): Promise<void> {
    TokenManager.clearTokens();
    toast.success('Logged out successfully');
  }

  // Utility method for other API clients
  getAccessToken(): string | null {
    return TokenManager.getAccessToken();
  }
}

// Custom error class
class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

// Export singleton instance
export const authApi = new ApiClient(); 