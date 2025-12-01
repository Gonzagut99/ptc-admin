/**
 * Types for Spring Security JWT Authentication
 * Re-exports from auto-generated OpenAPI types
 */

// Re-export constants from central location
export {
  AUTH_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_KEY,
} from "@/utils/constants";

// Import components from auto-generated API
import type { components } from "@/lib/api/api";

// Type aliases for easier usage
export type LoginRequestDto = components["schemas"]["LoginRequestDto"];
export type RefreshTokenRequestDto = components["schemas"]["RefreshTokenRequestDto"];
export type AuthResponseDto = components["schemas"]["AuthResponseDto"];
export type LogoutResponseDto = components["schemas"]["LogoutResponseDto"];
export type UserInfoDto = components["schemas"]["UserInfoDto"];
export type SessionInfoDto = components["schemas"]["SessionInfoDto"];
export type AuthErrorResponse = components["schemas"]["ErrorBody"];

// Auth state for context (custom type, not from API)
export interface AuthState {
  user: UserInfoDto | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
