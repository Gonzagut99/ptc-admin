import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";

import type { paths } from "@/lib/api/api";
import {
  getAccessToken,
  getRefreshToken,
  storeAuthData,
  clearAuthData,
} from "./auth-client";

export type JavaFetchErrorResponse = {
  statusCode: number;
  message: string;
  error: unknown;
  id?: string;
  category?: string;
  severity?: string;
  timestamp?: string;
  path?: string;
  method?: string;
};

export type JavaFetchError = typeof Error & JavaFetchErrorResponse;

const JAVA_BACKEND_URL =
  process.env.NEXT_PUBLIC_JAVA_API_URL ?? process.env.NEXT_PUBLIC_API_URL;

if (!JAVA_BACKEND_URL) {
  throw new Error(
    "NEXT_PUBLIC_JAVA_API_URL (o NEXT_PUBLIC_API_URL) environment variable is not set",
  );
}

// Flag para evitar múltiples intentos de refresh simultáneos
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Intenta refrescar el access token usando el refresh token
 * @returns true si el refresh fue exitoso, false en caso contrario
 */
async function tryRefreshToken(): Promise<boolean> {
  // Si ya hay un refresh en progreso, esperar a que termine
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return false;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      if (!JAVA_BACKEND_URL) {
        throw new Error("No esta configurada la URL del backend");
      }
      const baseUrl = backendUrl(JAVA_BACKEND_URL);
      const response = await fetch(`${baseUrl}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
        credentials: "include",
      });

      if (!response.ok) {
        // Refresh token inválido o expirado
        clearAuthData();
        return false;
      }

      const data = await response.json();
      storeAuthData(data);
      return true;
    } catch (error) {
      console.error("[Token Refresh] Error:", error);
      clearAuthData();
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export const backendUrl = (
  baseUrl: string,
  version?: string,
  endpoint?: string,
) => {
  let normalizedBase = baseUrl;
  let normalizedVersion = version;
  let normalizedEndpoint = endpoint;

  if (normalizedBase.endsWith("/")) {
    normalizedBase = normalizedBase.slice(0, -1);
  }
  if (normalizedVersion && normalizedVersion.startsWith("/")) {
    normalizedVersion = normalizedVersion.slice(1);
  }
  if (normalizedEndpoint && normalizedEndpoint.startsWith("/")) {
    normalizedEndpoint = normalizedEndpoint.slice(1);
  }

  const base = normalizedVersion
    ? `${normalizedBase}/${normalizedVersion}`
    : normalizedBase;
  const complete = normalizedEndpoint ? `${base}/${normalizedEndpoint}` : base;
  return complete;
};

/**
 * Enhanced fetch that includes JWT authorization header, credentials, and auto-refresh
 */
export const enhancedFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> => {
  // Helper function to make the actual request
  const makeRequest = async (authToken: string | null): Promise<Response> => {
    // Check if input is a Request object (openapi-fetch sends Request objects)
    if (input instanceof Request) {
      const originalRequest = input;
      const url = originalRequest.url;
      const method = originalRequest.method;
      
      const headersObj: Record<string, string> = {};
      originalRequest.headers.forEach((value, key) => {
        const lowerKey = key.toLowerCase();
        if (lowerKey !== "content-type" && lowerKey !== "authorization") {
          headersObj[key] = value;
        }
      });
      
      if (authToken) {
        headersObj["Authorization"] = `Bearer ${authToken}`;
      }
      
      if (["POST", "PUT", "PATCH"].includes(method)) {
        headersObj["Content-Type"] = "application/json";
      }

      let body: BodyInit | null = null;
      if (["POST", "PUT", "PATCH"].includes(method)) {
        body = await originalRequest.clone().text();
      }

      if (process.env.NODE_ENV === "development") {
        console.log("🚀 [enhancedFetch] Request URL:", url);
        console.log("🚀 [enhancedFetch] Method:", method);
      }

      return fetch(url, {
        method,
        headers: headersObj,
        body,
        credentials: "include",
      });
    }

    // Fallback for URL/string input
    const existingHeaders = init?.headers;
    let headersObj: Record<string, string> = {};

    if (existingHeaders) {
      if (existingHeaders instanceof Headers) {
        existingHeaders.forEach((value, key) => {
          const lowerKey = key.toLowerCase();
          if (lowerKey !== "authorization") {
            headersObj[key] = value;
          }
        });
      } else if (Array.isArray(existingHeaders)) {
        existingHeaders.forEach(([key, value]) => {
          const lowerKey = key.toLowerCase();
          if (lowerKey !== "authorization") {
            headersObj[key] = value;
          }
        });
      } else {
        headersObj = Object.fromEntries(
          Object.entries(existingHeaders).filter(
            ([key]) => key.toLowerCase() !== "authorization"
          )
        );
      }
    }

    if (authToken) {
      headersObj["Authorization"] = `Bearer ${authToken}`;
    }

    if (init?.body) {
      headersObj["Content-Type"] = "application/json";
    }

    if (process.env.NODE_ENV === "development") {
      console.log("🚀 [enhancedFetch] Request URL:", input.toString());
      console.log("🚀 [enhancedFetch] Method:", init?.method);
    }

    return fetch(input, {
      ...init,
      headers: headersObj,
      credentials: "include",
    });
  };

  // Get the current access token
  let token = getAccessToken();
  
  // Make the initial request
  let response = await makeRequest(token);

  if (process.env.NODE_ENV === "development") {
    console.log("✅ [enhancedFetch] Response status:", response.status);
  }

  // If we get a 401, try to refresh the token and retry
  if (response.status === 401 && !isRefreshing) {
    console.log("🔄 [enhancedFetch] Got 401, attempting token refresh...");
    
    const refreshed = await tryRefreshToken();
    
    if (refreshed) {
      console.log("✅ [enhancedFetch] Token refreshed successfully, retrying request...");
      // Get the new token and retry the request
      token = getAccessToken();
      response = await makeRequest(token);
      
      if (process.env.NODE_ENV === "development") {
        console.log("✅ [enhancedFetch] Retry response status:", response.status);
      }
    } else {
      console.log("❌ [enhancedFetch] Token refresh failed, redirecting to login...");
      // Redirect to login page if refresh failed
      if (typeof window !== "undefined") {
        window.location.href = "/auth/log-in";
      }
    }
  }

  return response;
};

function customQuerySerializer(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (typeof value === "object" && !Array.isArray(value)) {
      if (key === "requestDto") {
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          if (nestedValue !== undefined && nestedValue !== null) {
            searchParams.append(nestedKey, String(nestedValue));
          }
        });
      } else {
        searchParams.append(key, JSON.stringify(value));
      }
    } else {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}

/**
 * Custom body serializer to ensure JSON is sent correctly
 */
function customBodySerializer<T>(body: T): string {
  return JSON.stringify(body);
}

const fetchClient = createFetchClient<paths>({
  baseUrl: backendUrl(JAVA_BACKEND_URL),
  fetch: enhancedFetch,
  querySerializer: customQuerySerializer,
  bodySerializer: customBodySerializer,
});

export const backendJava = createClient(fetchClient);
