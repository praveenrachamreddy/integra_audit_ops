import { TokenResponse } from "./types";

// Configuration
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
export const API_V_STR = "/api/v1";

// Token management
class TokenManager {

  private static readonly ACCESS_TOKEN_KEY = "regops_access_token";
  private static readonly REFRESH_TOKEN_KEY = "regops_refresh_token";

  static getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  static clearTokens(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

}

// Custom error class
export class APIError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "ApiError";
  }

  static handleError(error: APIError): void {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname + window.location.search;
      const redirectTo = encodeURIComponent(currentPath);
      window.location.href = `/login?redirectTo=${redirectTo}`;
    }
  }
}

// Base API Client class that can be extended by other API handlers
export default abstract class BaseApiClient {
  protected apiPath: string = '';
  protected isRefreshing = false;
  protected refreshPromise: Promise<string> | null = null;

  protected async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${API_V_STR}${this.apiPath}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    // Add auth header if token exists
    const accessToken = TokenManager.getAccessToken();
    if (accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }

    let response = await fetch(url, config);

    // Handle token refresh if needed
    if (
      response.status === 401 &&
      accessToken &&
      !endpoint.includes("/refresh")
    ) {
      const newToken = await this.handleTokenRefresh();
      if (newToken) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${newToken}`,
        };
        response = await fetch(url, config);
      }
    }

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ detail: "An error occurred" }));
      throw new APIError(
        errorData.detail ?? "An error occurred",
        response.status
      );
    }

    return response.json();
  }

  protected async handleTokenRefresh(): Promise<string | null> {
    if (this.isRefreshing) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    const refreshToken = TokenManager.getRefreshToken();

    if (!refreshToken) {
      this.isRefreshing = false;
      this.clearTokens();
      APIError.handleError(new APIError("No refresh token found", 401));
      return null;
    }

    try {
      this.refreshPromise = this.refreshAccessToken(refreshToken);
      const newAccessToken = await this.refreshPromise;
      return newAccessToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      this.clearTokens();
      APIError.handleError(new APIError("Token refresh failed", 401));
      return null;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  protected async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      if (!refreshToken) {
        throw new Error("No refresh token provided");
      }
      const response: TokenResponse = await this.makeRequest("/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      this.setTokens(response.access_token, response.refresh_token);
      return response.access_token;
    } catch (error) {
      console.error("Token refresh failed:", error);
      throw new APIError("Token refresh failed", 401);
    }
  }

  protected setTokens(accessToken: string, refreshToken: string): void {
    TokenManager.setTokens(accessToken, refreshToken);
  }

  protected clearTokens(): void {
    TokenManager.clearTokens();
  }

  protected getAccessToken(): string | null {
    return TokenManager.getAccessToken();
  }

  protected getRefreshToken(): string | null {
    return TokenManager.getRefreshToken();
  }

}
