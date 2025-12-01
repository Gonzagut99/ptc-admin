/**
 * Authentication client for Spring Security JWT endpoints
 */
import {
  type AuthResponseDto,
  type LoginRequestDto,
  type RefreshTokenRequestDto,
  type LogoutResponseDto,
  type UserInfoDto,
  type SessionInfoDto,
  type AuthErrorResponse,
  AUTH_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_KEY,
} from "./auth-types";
import { AUTH_FLAG_COOKIE_NAME } from "@/utils/constants";

const JAVA_BACKEND_URL =
  process.env.NEXT_PUBLIC_JAVA_API_URL ?? process.env.NEXT_PUBLIC_API_URL;

if (!JAVA_BACKEND_URL) {
  throw new Error(
    "NEXT_PUBLIC_JAVA_API_URL (o NEXT_PUBLIC_API_URL) environment variable is not set",
  );
}

// Normalize base URL
const getBaseUrl = (): string => {
  let url = JAVA_BACKEND_URL;
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }
  return url;
};

/**
 * Set auth flag cookie (for middleware)
 */
const setAuthFlagCookie = (): void => {
  if (typeof document === "undefined") return;
  const isSecure = process.env.NODE_ENV === "production";
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  document.cookie = `${AUTH_FLAG_COOKIE_NAME}=true; path=/; expires=${expires.toUTCString()}${isSecure ? "; secure" : ""}; samesite=strict`;
};

/**
 * Clear auth flag cookie
 */
const clearAuthFlagCookie = (): void => {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_FLAG_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

/**
 * Get stored access token
 */
export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Get stored refresh token
 */
export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Get stored user info
 */
export const getStoredUser = (): UserInfoDto | null => {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Store auth tokens and user info
 */
export const storeAuthData = (data: AuthResponseDto): void => {
  if (typeof window === "undefined") return;
  if (data.accessToken) {
    localStorage.setItem(AUTH_TOKEN_KEY, data.accessToken);
  }
  if (data.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
  }
  if (data.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }
  // Set cookie flag for middleware
  setAuthFlagCookie();
};

/**
 * Clear auth tokens and user info
 */
export const clearAuthData = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  // Clear cookie flag
  clearAuthFlagCookie();
};

/**
 * Check if user is authenticated (has valid token)
 */
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

/**
 * Make authenticated request with JWT token
 */
const authFetch = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${getBaseUrl()}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const errorData: AuthErrorResponse = await response.json().catch(() => ({
      message: "Error de conexión",
      status: response.status.toString(),
    }));
    throw errorData;
  }

  return response.json();
};

/**
 * Login with email and password
 */
export const login = async (
  credentials: LoginRequestDto,
): Promise<AuthResponseDto> => {
  const response = await authFetch<AuthResponseDto>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  // Store tokens and user info
  storeAuthData(response);

  return response;
};

/**
 * Logout current session
 */
export const logout = async (): Promise<LogoutResponseDto> => {
  try {
    const response = await authFetch<LogoutResponseDto>("/auth/logout", {
      method: "POST",
    });
    return response;
  } finally {
    // Always clear local data
    clearAuthData();
  }
};

/**
 * Logout all sessions
 */
export const logoutAll = async (): Promise<LogoutResponseDto> => {
  try {
    const response = await authFetch<LogoutResponseDto>("/auth/logout-all", {
      method: "POST",
    });
    return response;
  } finally {
    // Always clear local data
    clearAuthData();
  }
};

/**
 * Refresh access token using refresh token
 */
export const refreshTokens = async (): Promise<AuthResponseDto> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw { message: "No refresh token available", status: "UNAUTHORIZED" };
  }

  const body: RefreshTokenRequestDto = { refreshToken };

  const response = await fetch(`${getBaseUrl()}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  });

  if (!response.ok) {
    clearAuthData();
    const errorData: AuthErrorResponse = await response.json().catch(() => ({
      message: "Error al refrescar token",
      status: response.status.toString(),
    }));
    throw errorData;
  }

  const data: AuthResponseDto = await response.json();
  storeAuthData(data);

  return data;
};

/**
 * Get current user info
 */
export const getCurrentUser = async (): Promise<UserInfoDto> => {
  return authFetch<UserInfoDto>("/auth/me", {
    method: "GET",
  });
};

/**
 * Get user sessions
 */
export const getUserSessions = async (): Promise<SessionInfoDto[]> => {
  return authFetch<SessionInfoDto[]>("/auth/sessions", {
    method: "GET",
  });
};

/**
 * Auth client object for easy access
 */
export const authClient = {
  login,
  logout,
  logoutAll,
  refreshTokens,
  getCurrentUser,
  getUserSessions,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  isAuthenticated,
  clearAuthData,
  storeAuthData,
};

export default authClient;
