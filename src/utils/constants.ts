/**
 * Constantes para el sistema de autenticación JWT
 */

// Nombre de la cookie para verificar autenticación en el middleware
// Esta cookie se establece cuando el usuario se autentica exitosamente
export const AUTH_FLAG_COOKIE_NAME = "ptc-auth-flag";

// Keys para localStorage (usadas en el cliente)
export const AUTH_TOKEN_KEY = "ptc_auth_token";
export const REFRESH_TOKEN_KEY = "ptc_refresh_token";
export const USER_KEY = "ptc_user";

/**
 * @deprecated Use AUTH_FLAG_COOKIE_NAME instead
 * Legacy: mantenido por compatibilidad con BetterAuth
 */
export const BETTER_AUTH_COOKIE_PREFIX = "work-wear-better-auth";
export const AUTH_COOKIE_NAME = AUTH_FLAG_COOKIE_NAME;
