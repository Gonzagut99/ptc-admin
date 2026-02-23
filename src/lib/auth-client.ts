/**
 * @deprecated This file is kept for backward compatibility.
 * Use @/lib/api-java/auth-client instead.
 *
 * This module re-exports the new JWT-based auth client.
 */

export {
  authClient,
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
  validateAndRefreshSession,
  isAccessTokenExpired,
} from "./api-java/auth-client";

/**
 * @deprecated Use authClient.clearAuthData() instead
 * Logout forzado que limpia cookies y storage del navegador.
 */
export async function forceLogout() {
  const { clearAuthData } = await import("./api-java/auth-client");
  clearAuthData();
  window.location.href = "/auth/log-in";
}
