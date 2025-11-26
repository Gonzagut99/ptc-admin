import { createAuthClient } from "better-auth/react";

/**
 * Limpia todas las cookies relacionadas con autenticación
 */
function clearAllAuthCookies() {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();

    // Eliminar solo cookies relacionadas con auth
    if (
      name.includes("better-auth") ||
      name.includes("work-wear-better-auth") ||
      name.includes("session") ||
      name.includes("__Secure-")
    ) {
      // Intentar eliminar con diferentes combinaciones de atributos
      const configs = [
        "path=/",
        "path=/; domain=" + window.location.hostname,
        "path=/; domain=." + window.location.hostname,
        "path=/; secure",
        "path=/; secure; samesite=strict",
        "path=/; secure; samesite=lax",
      ];

      configs.forEach((config) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; ${config}`;
      });
    }
  }
}

/**
 * Logout forzado que limpia cookies y storage del navegador.
 * Útil cuando la sesión es inválida y no se puede usar el endpoint normal de sign-out.
 */
export async function forceLogout() {
  // Limpiar storage del navegador
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch (e) {
    console.warn("⚠️ No se pudo limpiar storage", e);
  }

  // Limpiar cookies del lado del cliente
  clearAllAuthCookies();

  // Redirigir al login
  window.location.href = "/auth/log-in";
}

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});
